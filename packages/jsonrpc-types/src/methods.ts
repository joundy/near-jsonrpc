/**
 * THIS FILE IS GENERATED - DO NOT MODIFY DIRECTLY
 * Generated by @near-jsonrpc/jsonrpc-generator
 * 
 * @generated
 */
import { defineMethod } from "./types";
import type { RpcBlockRequest, RpcBlockResponse, RpcError, RpcSendTransactionRequest, CryptoHash, RpcTransactionResponse, RpcStateChangesInBlockByTypeRequest, RpcStateChangesInBlockResponse, RpcChunkRequest, RpcChunkResponse, RpcClientConfigRequest, RpcClientConfigResponse, RpcStateChangesInBlockRequest, RpcStateChangesInBlockByTypeResponse, RpcCongestionLevelRequest, RpcCongestionLevelResponse, GenesisConfigRequest, GenesisConfig, RpcLightClientBlockProofRequest, RpcLightClientBlockProofResponse, RpcLightClientExecutionProofRequest, RpcLightClientExecutionProofResponse, RpcMaintenanceWindowsRequest, JsonRpcResponseForArrayOfRangeOfUint64AndRpcErrorResponse, RpcProtocolConfigRequest, RpcProtocolConfigResponse, RpcReceiptRequest, RpcReceiptResponse, RpcSplitStorageInfoRequest, RpcSplitStorageInfoResponse, RpcTransactionStatusRequest, RpcValidatorsOrderedRequest, JsonRpcResponseForArrayOfValidatorStakeViewAndRpcErrorResponse, RpcGasPriceRequest, RpcGasPriceResponse, RpcHealthRequest, JsonRpcResponseForNullableRpcHealthResponseAndRpcErrorResponse, RpcNetworkInfoRequest, RpcNetworkInfoResponse, RpcLightClientNextBlockRequest, RpcLightClientNextBlockResponse, RpcQueryRequest, RpcQueryResponse, RpcStatusRequest, RpcStatusResponse, RpcValidatorRequest, RpcValidatorResponse } from "./schemas";
import { RpcBlockRequestSchema, RpcBlockResponseSchema, RpcErrorSchema, RpcSendTransactionRequestSchema, CryptoHashSchema, RpcTransactionResponseSchema, RpcStateChangesInBlockByTypeRequestSchema, RpcStateChangesInBlockResponseSchema, RpcChunkRequestSchema, RpcChunkResponseSchema, RpcClientConfigRequestSchema, RpcClientConfigResponseSchema, RpcStateChangesInBlockRequestSchema, RpcStateChangesInBlockByTypeResponseSchema, RpcCongestionLevelRequestSchema, RpcCongestionLevelResponseSchema, GenesisConfigRequestSchema, GenesisConfigSchema, RpcLightClientBlockProofRequestSchema, RpcLightClientBlockProofResponseSchema, RpcLightClientExecutionProofRequestSchema, RpcLightClientExecutionProofResponseSchema, RpcMaintenanceWindowsRequestSchema, JsonRpcResponseForArrayOfRangeOfUint64AndRpcErrorResponseSchema, RpcProtocolConfigRequestSchema, RpcProtocolConfigResponseSchema, RpcReceiptRequestSchema, RpcReceiptResponseSchema, RpcSplitStorageInfoRequestSchema, RpcSplitStorageInfoResponseSchema, RpcTransactionStatusRequestSchema, RpcValidatorsOrderedRequestSchema, JsonRpcResponseForArrayOfValidatorStakeViewAndRpcErrorResponseSchema, RpcGasPriceRequestSchema, RpcGasPriceResponseSchema, RpcHealthRequestSchema, JsonRpcResponseForNullableRpcHealthResponseAndRpcErrorResponseSchema, RpcNetworkInfoRequestSchema, RpcNetworkInfoResponseSchema, RpcLightClientNextBlockRequestSchema, RpcLightClientNextBlockResponseSchema, RpcQueryRequestSchema, RpcQueryResponseSchema, RpcStatusRequestSchema, RpcStatusResponseSchema, RpcValidatorRequestSchema, RpcValidatorResponseSchema } from "./zod-schemas";

/** Method definition for block RPC call */
export const block = defineMethod<RpcBlockRequest, RpcBlockResponse, RpcError>("block", RpcBlockRequestSchema, RpcBlockResponseSchema, RpcErrorSchema);
/** Method definition for broadcast_tx_async RPC call */
export const broadcastTxAsync = defineMethod<RpcSendTransactionRequest, CryptoHash, RpcError>("broadcast_tx_async", RpcSendTransactionRequestSchema, CryptoHashSchema, RpcErrorSchema);
/** Method definition for broadcast_tx_commit RPC call */
export const broadcastTxCommit = defineMethod<RpcSendTransactionRequest, RpcTransactionResponse, RpcError>("broadcast_tx_commit", RpcSendTransactionRequestSchema, RpcTransactionResponseSchema, RpcErrorSchema);
/** Method definition for changes RPC call */
export const changes = defineMethod<RpcStateChangesInBlockByTypeRequest, RpcStateChangesInBlockResponse, RpcError>("changes", RpcStateChangesInBlockByTypeRequestSchema, RpcStateChangesInBlockResponseSchema, RpcErrorSchema);
/** Method definition for chunk RPC call */
export const chunk = defineMethod<RpcChunkRequest, RpcChunkResponse, RpcError>("chunk", RpcChunkRequestSchema, RpcChunkResponseSchema, RpcErrorSchema);
/** Method definition for client_config RPC call */
export const clientConfig = defineMethod<RpcClientConfigRequest, RpcClientConfigResponse, RpcError>("client_config", RpcClientConfigRequestSchema, RpcClientConfigResponseSchema, RpcErrorSchema);
/** Method definition for EXPERIMENTAL_changes RPC call */
export const EXPERIMENTALChanges = defineMethod<RpcStateChangesInBlockByTypeRequest, RpcStateChangesInBlockResponse, RpcError>("EXPERIMENTAL_changes", RpcStateChangesInBlockByTypeRequestSchema, RpcStateChangesInBlockResponseSchema, RpcErrorSchema);
/** Method definition for EXPERIMENTAL_changes_in_block RPC call */
export const EXPERIMENTALChangesInBlock = defineMethod<RpcStateChangesInBlockRequest, RpcStateChangesInBlockByTypeResponse, RpcError>("EXPERIMENTAL_changes_in_block", RpcStateChangesInBlockRequestSchema, RpcStateChangesInBlockByTypeResponseSchema, RpcErrorSchema);
/** Method definition for EXPERIMENTAL_congestion_level RPC call */
export const EXPERIMENTALCongestionLevel = defineMethod<RpcCongestionLevelRequest, RpcCongestionLevelResponse, RpcError>("EXPERIMENTAL_congestion_level", RpcCongestionLevelRequestSchema, RpcCongestionLevelResponseSchema, RpcErrorSchema);
/** Method definition for EXPERIMENTAL_genesis_config RPC call */
export const EXPERIMENTALGenesisConfig = defineMethod<GenesisConfigRequest, GenesisConfig, RpcError>("EXPERIMENTAL_genesis_config", GenesisConfigRequestSchema, GenesisConfigSchema, RpcErrorSchema);
/** Method definition for EXPERIMENTAL_light_client_block_proof RPC call */
export const EXPERIMENTALLightClientBlockProof = defineMethod<RpcLightClientBlockProofRequest, RpcLightClientBlockProofResponse, RpcError>("EXPERIMENTAL_light_client_block_proof", RpcLightClientBlockProofRequestSchema, RpcLightClientBlockProofResponseSchema, RpcErrorSchema);
/** Method definition for EXPERIMENTAL_light_client_proof RPC call */
export const EXPERIMENTALLightClientProof = defineMethod<RpcLightClientExecutionProofRequest, RpcLightClientExecutionProofResponse, RpcError>("EXPERIMENTAL_light_client_proof", RpcLightClientExecutionProofRequestSchema, RpcLightClientExecutionProofResponseSchema, RpcErrorSchema);
/** Method definition for EXPERIMENTAL_maintenance_windows RPC call */
export const EXPERIMENTALMaintenanceWindows = defineMethod<RpcMaintenanceWindowsRequest, JsonRpcResponseForArrayOfRangeOfUint64AndRpcErrorResponse, RpcError>("EXPERIMENTAL_maintenance_windows", RpcMaintenanceWindowsRequestSchema, JsonRpcResponseForArrayOfRangeOfUint64AndRpcErrorResponseSchema, RpcErrorSchema);
/** Method definition for EXPERIMENTAL_protocol_config RPC call */
export const EXPERIMENTALProtocolConfig = defineMethod<RpcProtocolConfigRequest, RpcProtocolConfigResponse, RpcError>("EXPERIMENTAL_protocol_config", RpcProtocolConfigRequestSchema, RpcProtocolConfigResponseSchema, RpcErrorSchema);
/** Method definition for EXPERIMENTAL_receipt RPC call */
export const EXPERIMENTALReceipt = defineMethod<RpcReceiptRequest, RpcReceiptResponse, RpcError>("EXPERIMENTAL_receipt", RpcReceiptRequestSchema, RpcReceiptResponseSchema, RpcErrorSchema);
/** Method definition for EXPERIMENTAL_split_storage_info RPC call */
export const EXPERIMENTALSplitStorageInfo = defineMethod<RpcSplitStorageInfoRequest, RpcSplitStorageInfoResponse, RpcError>("EXPERIMENTAL_split_storage_info", RpcSplitStorageInfoRequestSchema, RpcSplitStorageInfoResponseSchema, RpcErrorSchema);
/** Method definition for EXPERIMENTAL_tx_status RPC call */
export const EXPERIMENTALTxStatus = defineMethod<RpcTransactionStatusRequest, RpcTransactionResponse, RpcError>("EXPERIMENTAL_tx_status", RpcTransactionStatusRequestSchema, RpcTransactionResponseSchema, RpcErrorSchema);
/** Method definition for EXPERIMENTAL_validators_ordered RPC call */
export const EXPERIMENTALValidatorsOrdered = defineMethod<RpcValidatorsOrderedRequest, JsonRpcResponseForArrayOfValidatorStakeViewAndRpcErrorResponse, RpcError>("EXPERIMENTAL_validators_ordered", RpcValidatorsOrderedRequestSchema, JsonRpcResponseForArrayOfValidatorStakeViewAndRpcErrorResponseSchema, RpcErrorSchema);
/** Method definition for gas_price RPC call */
export const gasPrice = defineMethod<RpcGasPriceRequest, RpcGasPriceResponse, RpcError>("gas_price", RpcGasPriceRequestSchema, RpcGasPriceResponseSchema, RpcErrorSchema);
/** Method definition for health RPC call */
export const health = defineMethod<RpcHealthRequest, JsonRpcResponseForNullableRpcHealthResponseAndRpcErrorResponse, RpcError>("health", RpcHealthRequestSchema, JsonRpcResponseForNullableRpcHealthResponseAndRpcErrorResponseSchema, RpcErrorSchema);
/** Method definition for light_client_proof RPC call */
export const lightClientProof = defineMethod<RpcLightClientExecutionProofRequest, RpcLightClientExecutionProofResponse, RpcError>("light_client_proof", RpcLightClientExecutionProofRequestSchema, RpcLightClientExecutionProofResponseSchema, RpcErrorSchema);
/** Method definition for network_info RPC call */
export const networkInfo = defineMethod<RpcNetworkInfoRequest, RpcNetworkInfoResponse, RpcError>("network_info", RpcNetworkInfoRequestSchema, RpcNetworkInfoResponseSchema, RpcErrorSchema);
/** Method definition for next_light_client_block RPC call */
export const nextLightClientBlock = defineMethod<RpcLightClientNextBlockRequest, RpcLightClientNextBlockResponse, RpcError>("next_light_client_block", RpcLightClientNextBlockRequestSchema, RpcLightClientNextBlockResponseSchema, RpcErrorSchema);
/** Method definition for query RPC call */
export const query = defineMethod<RpcQueryRequest, RpcQueryResponse, RpcError>("query", RpcQueryRequestSchema, RpcQueryResponseSchema, RpcErrorSchema);
/** Method definition for send_tx RPC call */
export const sendTx = defineMethod<RpcSendTransactionRequest, RpcTransactionResponse, RpcError>("send_tx", RpcSendTransactionRequestSchema, RpcTransactionResponseSchema, RpcErrorSchema);
/** Method definition for status RPC call */
export const status = defineMethod<RpcStatusRequest, RpcStatusResponse, RpcError>("status", RpcStatusRequestSchema, RpcStatusResponseSchema, RpcErrorSchema);
/** Method definition for tx RPC call */
export const tx = defineMethod<RpcTransactionStatusRequest, RpcTransactionResponse, RpcError>("tx", RpcTransactionStatusRequestSchema, RpcTransactionResponseSchema, RpcErrorSchema);
/** Method definition for validators RPC call */
export const validators = defineMethod<RpcValidatorRequest, RpcValidatorResponse, RpcError>("validators", RpcValidatorRequestSchema, RpcValidatorResponseSchema, RpcErrorSchema);
