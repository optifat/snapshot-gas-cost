import { BigNumberish, TransactionReceipt, TransactionResponse} from 'ethers'
import { expect, use } from 'chai'

import { jestSnapshotPlugin } from 'mocha-chai-jest-snapshot'
use(jestSnapshotPlugin())

export default async function snapshotGasCost(
  x:
    | TransactionResponse
    | Promise<TransactionResponse>
    | TransactionResponse[]
    | Promise<TransactionResponse>[]
    | TransactionReceipt
    | Promise<BigNumberish>
    | BigNumberish
): Promise<void> {
  const unpromised = await x
  if (Array.isArray(unpromised)) {
    const unpromisedDeep = await Promise.all(unpromised.map(async (p) => await p))
    const waited = await Promise.all(unpromisedDeep.map(async (p) => p.wait()))
    unpromisedDeep.map((u, i) => ({u, w: waited[i]})).forEach((e) => 
      expect({
        gasUsed: e.w?.gasUsed,
        calldataByteLength: e.u.data.length / 2 - 1,
      }).toMatchSnapshot()
    )
  } else if (unpromised instanceof TransactionResponse) {
    const waited = await unpromised.wait()
    expect({
      gasUsed: Number(waited?.gasUsed),
      calldataByteLength: unpromised.data.length / 2 - 1,
    }).toMatchSnapshot()
  } else if (unpromised instanceof TransactionReceipt) {
    const response = await unpromised.getTransaction();
    expect({
      gasUsed: Number(unpromised?.gasUsed),
      calldataByteLength: response.data.length / 2 - 1,
    }).toMatchSnapshot()
  } else {
    expect(Number(unpromised)).toMatchSnapshot()
  }
}
