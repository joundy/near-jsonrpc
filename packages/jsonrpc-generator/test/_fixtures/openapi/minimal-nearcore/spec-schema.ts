export type AccountId = string;
export type BandwidthRequest = {
    /** @description Bitmap which describes what values of bandwidth are requested. */
    requestedValuesBitmap: BandwidthRequestBitmap;
    /**
     * Format: uint16
     * @description Requesting bandwidth to this shard.
     */
    toShard: number;
};
export type BandwidthRequestBitmap = {
    data: number[];
};
export type BandwidthRequests = {
    V1: BandwidthRequestsV1;
};
export type BandwidthRequestsV1 = {
    requests: BandwidthRequest[];
};
export type BlockHeaderView = {
    approvals: (Signature | (null))[];
    blockBodyHash?: CryptoHash | (null);
    blockMerkleRoot: CryptoHash;
    /** Format: uint64 */
    blockOrdinal?: number | null;
    challengesResult: SlashedValidator[];
    challengesRoot: CryptoHash;
    chunkEndorsements?: number[][] | null;
    chunkHeadersRoot: CryptoHash;
    chunkMask: boolean[];
    chunkReceiptsRoot: CryptoHash;
    chunkTxRoot: CryptoHash;
    /** Format: uint64 */
    chunksIncluded: number;
    epochId: CryptoHash;
    epochSyncDataHash?: CryptoHash | (null);
    gasPrice: string;
    hash: CryptoHash;
    /** Format: uint64 */
    height: number;
    lastDsFinalBlock: CryptoHash;
    lastFinalBlock: CryptoHash;
    /** Format: uint32 */
    latestProtocolVersion: number;
    nextBpHash: CryptoHash;
    nextEpochId: CryptoHash;
    outcomeRoot: CryptoHash;
    /** @description The hash of the previous Block */
    prevHash: CryptoHash;
    /** Format: uint64 */
    prevHeight?: number | null;
    prevStateRoot: CryptoHash;
    randomValue: CryptoHash;
    /** @description TODO(2271): deprecated. */
    rentPaid: string;
    /** @description Signature of the block producer. */
    signature: Signature;
    /**
     * Format: uint64
     * @description Legacy json number. Should not be used.
     */
    timestamp: number;
    timestampNanosec: string;
    totalSupply: string;
    validatorProposals: ValidatorStakeView[];
    /** @description TODO(2271): deprecated. */
    validatorReward: string;
};
export type BlockId = number | CryptoHash;
export type ChunkHeaderView = {
    balanceBurnt: string;
    bandwidthRequests?: BandwidthRequests | (null);
    chunkHash: CryptoHash;
    congestionInfo?: CongestionInfoView | (null);
    /** Format: uint64 */
    encodedLength: number;
    encodedMerkleRoot: CryptoHash;
    /** Format: uint64 */
    gasLimit: number;
    /** Format: uint64 */
    gasUsed: number;
    /** Format: uint64 */
    heightCreated: number;
    /** Format: uint64 */
    heightIncluded: number;
    outcomeRoot: CryptoHash;
    outgoingReceiptsRoot: CryptoHash;
    prevBlockHash: CryptoHash;
    prevStateRoot: CryptoHash;
    /** @description TODO(2271): deprecated. */
    rentPaid: string;
    shardId: ShardId;
    signature: Signature;
    txRoot: CryptoHash;
    validatorProposals: ValidatorStakeView[];
    /** @description TODO(2271): deprecated. */
    validatorReward: string;
};
export type CongestionInfoView = {
    /** Format: uint16 */
    allowedShard: number;
    bufferedReceiptsGas: string;
    delayedReceiptsGas: string;
    /** Format: uint64 */
    receiptBytes: number;
};
export type CryptoHash = string;
export type Finality = "optimistic" | "near-final" | "final";
export type PublicKey = string;
export type Range_of_uint64 = {
    /** Format: uint64 */
    end: number;
    /** Format: uint64 */
    start: number;
};
export type RpcBlockRequest = {
    blockId: BlockId;
} | {
    finality: Finality;
} | {
    syncCheckpoint: SyncCheckpoint;
};
export type RpcBlockResponse = {
    /** @description The AccountId of the author of the Block */
    author: AccountId;
    chunks: ChunkHeaderView[];
    header: BlockHeaderView;
};
export type RpcError = {
    cause?: unknown;
    /**
     * Format: int64
     * @description Deprecated please use the `error_struct` instead
     */
    code: number;
    /** @description Deprecated please use the `error_struct` instead */
    data?: unknown;
    /** @description Deprecated please use the `error_struct` instead */
    message: string;
    name?: unknown;
} & ({
    cause: RpcRequestValidationErrorKind;
    /** @enum {string} */
    name: "REQUEST_VALIDATION_ERROR";
} | {
    cause: unknown;
    /** @enum {string} */
    name: "HANDLER_ERROR";
} | {
    cause: unknown;
    /** @enum {string} */
    name: "INTERNAL_ERROR";
});
export type RpcHealthRequest = null;
export type RpcHealthResponse = null;
export type RpcMaintenanceWindowsRequest = {
    accountId: AccountId;
};
export type RpcRequestValidationErrorKind = {
    info: {
        methodName: string;
    };
    /** @enum {string} */
    name: "METHOD_NOT_FOUND";
} | {
    info: {
        errorMessage: string;
    };
    /** @enum {string} */
    name: "PARSE_ERROR";
};
export type RpcValidatorsOrderedRequest = {
    blockId?: BlockId | (null);
};
export type ShardId = number;
export type Signature = string;
export type SlashedValidator = {
    accountId: AccountId;
    isDoubleSign: boolean;
};
export type SyncCheckpoint = "genesis" | "earliest_available";
export type ValidatorStakeView = {
    /** @enum {string} */
    validatorStakeStructVersion: "V1";
} & ValidatorStakeViewV1;
export type ValidatorStakeViewV1 = {
    accountId: AccountId;
    publicKey: PublicKey;
    stake: string;
};
export type JsonRpcResponseForArrayOfRangeOfUint64AndRpcErrorResponse = Range_of_uint64[];
export type JsonRpcResponseForArrayOfValidatorStakeViewAndRpcErrorResponse = ValidatorStakeView[];
export type JsonRpcResponseForNullableRpcHealthResponseAndRpcErrorResponse = RpcHealthResponse | (null);
