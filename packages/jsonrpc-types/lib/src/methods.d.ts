import type { RpcBlockRequest, RpcBlockResponse, RpcError, RpcSendTransactionRequest, RpcTransactionResponse, RpcStateChangesInBlockByTypeRequest, RpcStateChangesInBlockResponse, RpcChunkRequest, RpcChunkResponse, RpcClientConfigRequest, RpcClientConfigResponse, RpcStateChangesInBlockRequest, RpcStateChangesInBlockByTypeResponse, RpcCongestionLevelRequest, RpcCongestionLevelResponse, GenesisConfigRequest, GenesisConfig, RpcLightClientBlockProofRequest, RpcLightClientBlockProofResponse, RpcLightClientExecutionProofRequest, RpcLightClientExecutionProofResponse, RpcMaintenanceWindowsRequest, Range_of_uint64, RpcProtocolConfigRequest, RpcProtocolConfigResponse, RpcReceiptRequest, RpcReceiptResponse, RpcSplitStorageInfoRequest, RpcSplitStorageInfoResponse, RpcTransactionStatusRequest, RpcValidatorsOrderedRequest, ValidatorStakeView, RpcGasPriceRequest, RpcGasPriceResponse, RpcHealthRequest, RpcHealthResponse, RpcNetworkInfoRequest, RpcNetworkInfoResponse, RpcLightClientNextBlockRequest, RpcLightClientNextBlockResponse, RpcQueryRequest, RpcQueryResponse, RpcStatusRequest, RpcStatusResponse, RpcValidatorRequest, RpcValidatorResponse } from "./schemas";
/** Method definition for block RPC call */
export declare const block: import("./types").Method<RpcBlockRequest, RpcBlockResponse, RpcError>;
/** Method definition for broadcast_tx_async RPC call */
export declare const broadcastTxAsync: import("./types").Method<RpcSendTransactionRequest, string, RpcError>;
/** Method definition for broadcast_tx_commit RPC call */
export declare const broadcastTxCommit: import("./types").Method<RpcSendTransactionRequest, RpcTransactionResponse, RpcError>;
/** Method definition for changes RPC call */
export declare const changes: import("./types").Method<RpcStateChangesInBlockByTypeRequest, RpcStateChangesInBlockResponse, RpcError>;
/** Method definition for chunk RPC call */
export declare const chunk: import("./types").Method<RpcChunkRequest, RpcChunkResponse, RpcError>;
/** Method definition for client_config RPC call */
export declare const clientConfig: import("./types").Method<RpcClientConfigRequest, RpcClientConfigResponse, RpcError>;
/** Method definition for EXPERIMENTAL_changes RPC call */
export declare const EXPERIMENTALChanges: import("./types").Method<RpcStateChangesInBlockByTypeRequest, RpcStateChangesInBlockResponse, RpcError>;
/** Method definition for EXPERIMENTAL_changes_in_block RPC call */
export declare const EXPERIMENTALChangesInBlock: import("./types").Method<RpcStateChangesInBlockRequest, RpcStateChangesInBlockByTypeResponse, RpcError>;
/** Method definition for EXPERIMENTAL_congestion_level RPC call */
export declare const EXPERIMENTALCongestionLevel: import("./types").Method<RpcCongestionLevelRequest, RpcCongestionLevelResponse, RpcError>;
/** Method definition for EXPERIMENTAL_genesis_config RPC call */
export declare const EXPERIMENTALGenesisConfig: import("./types").Method<GenesisConfigRequest, GenesisConfig, RpcError>;
/** Method definition for EXPERIMENTAL_light_client_block_proof RPC call */
export declare const EXPERIMENTALLightClientBlockProof: import("./types").Method<RpcLightClientBlockProofRequest, RpcLightClientBlockProofResponse, RpcError>;
/** Method definition for EXPERIMENTAL_light_client_proof RPC call */
export declare const EXPERIMENTALLightClientProof: import("./types").Method<RpcLightClientExecutionProofRequest, RpcLightClientExecutionProofResponse, RpcError>;
/** Method definition for EXPERIMENTAL_maintenance_windows RPC call */
export declare const EXPERIMENTALMaintenanceWindows: import("./types").Method<RpcMaintenanceWindowsRequest, Range_of_uint64, RpcError>;
/** Method definition for EXPERIMENTAL_protocol_config RPC call */
export declare const EXPERIMENTALProtocolConfig: import("./types").Method<RpcProtocolConfigRequest, RpcProtocolConfigResponse, RpcError>;
/** Method definition for EXPERIMENTAL_receipt RPC call */
export declare const EXPERIMENTALReceipt: import("./types").Method<RpcReceiptRequest, RpcReceiptResponse, RpcError>;
/** Method definition for EXPERIMENTAL_split_storage_info RPC call */
export declare const EXPERIMENTALSplitStorageInfo: import("./types").Method<RpcSplitStorageInfoRequest, RpcSplitStorageInfoResponse, RpcError>;
/** Method definition for EXPERIMENTAL_tx_status RPC call */
export declare const EXPERIMENTALTxStatus: import("./types").Method<RpcTransactionStatusRequest, RpcTransactionResponse, RpcError>;
/** Method definition for EXPERIMENTAL_validators_ordered RPC call */
export declare const EXPERIMENTALValidatorsOrdered: import("./types").Method<RpcValidatorsOrderedRequest, ValidatorStakeView, RpcError>;
/** Method definition for gas_price RPC call */
export declare const gasPrice: import("./types").Method<RpcGasPriceRequest, RpcGasPriceResponse, RpcError>;
/** Method definition for health RPC call */
export declare const health: import("./types").Method<RpcHealthRequest, RpcHealthResponse, RpcError>;
/** Method definition for light_client_proof RPC call */
export declare const lightClientProof: import("./types").Method<RpcLightClientExecutionProofRequest, RpcLightClientExecutionProofResponse, RpcError>;
/** Method definition for network_info RPC call */
export declare const networkInfo: import("./types").Method<RpcNetworkInfoRequest, RpcNetworkInfoResponse, RpcError>;
/** Method definition for next_light_client_block RPC call */
export declare const nextLightClientBlock: import("./types").Method<RpcLightClientNextBlockRequest, RpcLightClientNextBlockResponse, RpcError>;
/** Method definition for query RPC call */
export declare const query: import("./types").Method<RpcQueryRequest, RpcQueryResponse, RpcError>;
/** Method definition for send_tx RPC call */
export declare const sendTx: import("./types").Method<RpcSendTransactionRequest, RpcTransactionResponse, RpcError>;
/** Method definition for status RPC call */
export declare const status: import("./types").Method<RpcStatusRequest, RpcStatusResponse, RpcError>;
/** Method definition for tx RPC call */
export declare const tx: import("./types").Method<RpcTransactionStatusRequest, RpcTransactionResponse, RpcError>;
/** Method definition for validators RPC call */
export declare const validators: import("./types").Method<RpcValidatorRequest, RpcValidatorResponse, RpcError>;
