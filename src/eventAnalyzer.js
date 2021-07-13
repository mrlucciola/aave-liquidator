// modules
import { ethers } from 'ethers';
import { JsonRpcProvider } from '@ethersproject/providers';
// local imports
import { address as aaveLendingPoolAddress, abi as aaveLendingPoolAbi } from './abis/aave/general/aaveLendingPool';
// constants
const provider = new JsonRpcProvider(
  "https://rpc-mainnet.matic.quiknode.pro",
  137,
);
// fxns
const getEventsOfInterestNew = abi => {
  const eventTypesofInterest = ['Borrow', 'Deposit', 'Withdraw', 'Repay'];
  const eventsOfInterest = abi.filter(obj => {
    return obj.type === 'event' && eventTypesofInterest.includes(obj.name);
  });
  return eventsOfInterest;
};
const decodeSingleArrayOfLogs = (_decoder, log, _topic, _indexedInputs, _unindexedInputs) => {
  let decodedTopics = [];
  let decodedData = [];
  if (log.topics.includes(_topic)) {
    decodedTopics = _indexedInputs.map(input => {
      const value = _decoder.decode(
        [input.type],
        log.topics[_indexedInputs.indexOf(input) + 1]
      );
      return `${input.name}: ${value}`;
    });
    const decodedDataRaw = _decoder.decode(_unindexedInputs, log.data);

    decodedData = _unindexedInputs.map((input, i) => {
      return `${input.name}: ${decodedDataRaw[i]}`;
    });
  }
  return decodedTopics.concat(decodedData);
};
/**
 * cycle thru events of interest and build object that holds
 *  topics, event signatures, input types, and logs (decoded and not)
 * @param {*} _eventsOfInterest 
 * @param {*} _blockStart 
 * @param {*} _blockEnd 
 */
const combine = async (_eventsOfInterest, _blockStart, _blockEnd) => {
  if (!_blockStart || typeof _blockStart !== typeof 10) throw new Error('Add block start.  blockStart: ', _blockStart);
  if (!_blockEnd   || typeof _blockEnd   !== typeof 10) throw new Error('Add block end.  blockEnd:', _blockEnd);
  const outputObj = {};
  const decoder = new ethers.utils.AbiCoder();
  for (let eventObj of _eventsOfInterest) {
    const { inputs: eventInputs } = eventObj;
    const inputTypes = eventInputs.map(({ type }) => type);
    const eventSig = `${eventObj.name}(${inputTypes.toString()})`;
    const topic = ethers.utils.keccak256(ethers.utils.toUtf8Bytes(eventSig));
    const indexedInputs = eventInputs.filter(({ indexed }) => indexed);
    const unindexedInputs = eventInputs.filter(({ indexed }) => !indexed);
    const logs = await provider.getLogs({
      fromBlock: _blockStart,
      toBlock: _blockEnd,
      address: aaveLendingPoolAddress,
      topics: [topic],
    });

    const decodedLogs = logs.map(log => decodeSingleArrayOfLogs(decoder, log, topic, indexedInputs, unindexedInputs));
    outputObj[eventObj.name] = {
      types: inputTypes,
      eventSig,
      topic,
      indexedInputs,
      unindexedInputs,
      logs,
      decodedLogs,
    };
  }
};

const testBlockStart = 16030770;
const testBlockEnd = 16030777;

const main = async () => {
  const eventsOfInterestArr = getEventsOfInterestNew(aaveLendingPoolAbi);

  const outputObj = await combine(eventsOfInterestArr, testBlockStart, testBlockEnd);

  console.log('displaying output');
  Object.keys(outputObj).forEach(name => {
    console.log(`\n Showing ${name} events: `)
    outputObj[name].decodedLogs.forEach(dLog => {
      console.log('Event:', dLog);
    });
  });
};

main();