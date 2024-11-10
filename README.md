# snapshot-gas-cost

Tiny utility function for snapshotting gas costs in unit tests.

Fork of [Uniswap gas snapshotter](https://github.com/Uniswap/snapshot-gas-cost) with ethers v6 support
## Objective

This function is useful for smart contract testing against hardhat networks. Use it to produce snapshot diffs that you
commit to your repository.

## Usage

```typescript
import snapshotGasCost from 'snapshot-gas-cost'
import {BaseContract} from "ethers";

describe('gas tests', () => {
    let myContract: BaseContract
    beforeEach('initialize contract', () => {
        /// initialize myContract
    })
    
    it('gas snapshot for a mutable function', async () => {
        await snapshotGasCost(myContract.getFunction('someMutableFunction')())
    })
    
    it('gas snapshot for a view function', async () => {
        await snapshotGasCost(myContract.estimateGas.someViewFunction('someViewFunction')())
    })
})
```

`BaseContract` is replaceable by other instances (e.g. `typechain` ones) of `Contract` type for more convenience
