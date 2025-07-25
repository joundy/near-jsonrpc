export type paths = {
    "/block": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        /** @description Returns block details for given height or hash */
        post: operations["block"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/EXPERIMENTAL_maintenance_windows": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        /** @description Returns the future windows for maintenance in current epoch for the specified account. In the maintenance windows, the node will not be block producer or chunk producer */
        post: operations["EXPERIMENTAL_maintenance_windows"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/EXPERIMENTAL_validators_ordered": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        /** @description Returns the current epoch validators ordered in the block producer order with repetition. This endpoint is solely used for bridge currently and is not intended for other external use cases. */
        post: operations["EXPERIMENTAL_validators_ordered"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/health": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        /** @description Returns the current health status of the RPC node the client connects to. */
        post: operations["health"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
};
export type webhooks = Record<string, never>;
export type components = {
    schemas: {
        /** @description NEAR Account Identifier.
         *
         *     This is a unique, syntactically valid, human-readable account identifier on the NEAR network.
         *
         *     [See the crate-level docs for information about validation.](index.html#account-id-rules)
         *
         *     Also see [Error kind precedence](AccountId#error-kind-precedence).
         *
         *     ## Examples
         *
         *     ```
         *     use near_account_id::AccountId;
         *
         *     let alice: AccountId = "alice.near".parse().unwrap();
         *
         *     assert!("ƒelicia.near".parse::<AccountId>().is_err()); // (ƒ is not f)
         *     ``` */
        AccountId: string;
        /** @description `BandwidthRequest` describes the size of receipts that a shard would like to send to another shard.
         *     When a shard wants to send a lot of receipts to another shard, it needs to create a request and wait
         *     for a bandwidth grant from the bandwidth scheduler. */
        BandwidthRequest: {
            /** @description Bitmap which describes what values of bandwidth are requested. */
            requested_values_bitmap: components["schemas"]["BandwidthRequestBitmap"];
            /**
             * Format: uint16
             * @description Requesting bandwidth to this shard.
             */
            to_shard: number;
        };
        /** @description Bitmap which describes which values from the predefined list are being requested.
         *     The nth bit is set to 1 when the nth value from the list is being requested. */
        BandwidthRequestBitmap: {
            data: number[];
        };
        /** @description A list of shard's bandwidth requests.
         *     Describes how much the shard would like to send to other shards. */
        BandwidthRequests: {
            V1: components["schemas"]["BandwidthRequestsV1"];
        };
        /** @description Version 1 of [`BandwidthRequest`]. */
        BandwidthRequestsV1: {
            requests: components["schemas"]["BandwidthRequest"][];
        };
        /** @description Contains main info about the block. */
        BlockHeaderView: {
            approvals: (components["schemas"]["Signature"] | (null))[];
            block_body_hash?: components["schemas"]["CryptoHash"] | (null);
            block_merkle_root: components["schemas"]["CryptoHash"];
            /** Format: uint64 */
            block_ordinal?: number | null;
            challenges_result: components["schemas"]["SlashedValidator"][];
            challenges_root: components["schemas"]["CryptoHash"];
            chunk_endorsements?: number[][] | null;
            chunk_headers_root: components["schemas"]["CryptoHash"];
            chunk_mask: boolean[];
            chunk_receipts_root: components["schemas"]["CryptoHash"];
            chunk_tx_root: components["schemas"]["CryptoHash"];
            /** Format: uint64 */
            chunks_included: number;
            epoch_id: components["schemas"]["CryptoHash"];
            epoch_sync_data_hash?: components["schemas"]["CryptoHash"] | (null);
            gas_price: string;
            hash: components["schemas"]["CryptoHash"];
            /** Format: uint64 */
            height: number;
            last_ds_final_block: components["schemas"]["CryptoHash"];
            last_final_block: components["schemas"]["CryptoHash"];
            /** Format: uint32 */
            latest_protocol_version: number;
            next_bp_hash: components["schemas"]["CryptoHash"];
            next_epoch_id: components["schemas"]["CryptoHash"];
            outcome_root: components["schemas"]["CryptoHash"];
            /** @description The hash of the previous Block */
            prev_hash: components["schemas"]["CryptoHash"];
            /** Format: uint64 */
            prev_height?: number | null;
            prev_state_root: components["schemas"]["CryptoHash"];
            random_value: components["schemas"]["CryptoHash"];
            /** @description TODO(2271): deprecated. */
            rent_paid: string;
            /** @description Signature of the block producer. */
            signature: components["schemas"]["Signature"];
            /**
             * Format: uint64
             * @description Legacy json number. Should not be used.
             */
            timestamp: number;
            timestamp_nanosec: string;
            total_supply: string;
            validator_proposals: components["schemas"]["ValidatorStakeView"][];
            /** @description TODO(2271): deprecated. */
            validator_reward: string;
        };
        BlockId: number | components["schemas"]["CryptoHash"];
        /** @description Contains main info about the chunk. */
        ChunkHeaderView: {
            balance_burnt: string;
            bandwidth_requests?: components["schemas"]["BandwidthRequests"] | (null);
            chunk_hash: components["schemas"]["CryptoHash"];
            congestion_info?: components["schemas"]["CongestionInfoView"] | (null);
            /** Format: uint64 */
            encoded_length: number;
            encoded_merkle_root: components["schemas"]["CryptoHash"];
            /** Format: uint64 */
            gas_limit: number;
            /** Format: uint64 */
            gas_used: number;
            /** Format: uint64 */
            height_created: number;
            /** Format: uint64 */
            height_included: number;
            outcome_root: components["schemas"]["CryptoHash"];
            outgoing_receipts_root: components["schemas"]["CryptoHash"];
            prev_block_hash: components["schemas"]["CryptoHash"];
            prev_state_root: components["schemas"]["CryptoHash"];
            /** @description TODO(2271): deprecated. */
            rent_paid: string;
            shard_id: components["schemas"]["ShardId"];
            signature: components["schemas"]["Signature"];
            tx_root: components["schemas"]["CryptoHash"];
            validator_proposals: components["schemas"]["ValidatorStakeView"][];
            /** @description TODO(2271): deprecated. */
            validator_reward: string;
        };
        /** @description Stores the congestion level of a shard. More info about congestion [here](https://near.github.io/nearcore/architecture/how/receipt-congestion.html?highlight=congestion#receipt-congestion) */
        CongestionInfoView: {
            /** Format: uint16 */
            allowed_shard: number;
            buffered_receipts_gas: string;
            delayed_receipts_gas: string;
            /** Format: uint64 */
            receipt_bytes: number;
        };
        CryptoHash: string;
        /**
         * @description Different types of finality.
         * @enum {string}
         */
        Finality: "optimistic" | "near-final" | "final";
        /** JsonRpcRequest_for_block */
        JsonRpcRequest_for_block: {
            id: string;
            jsonrpc: string;
            /** @enum {string} */
            method: "block";
            params: components["schemas"]["RpcBlockRequest"];
        };
        /** JsonRpcRequest_for_EXPERIMENTAL_maintenance_windows */
        JsonRpcRequest_for_EXPERIMENTAL_maintenance_windows: {
            id: string;
            jsonrpc: string;
            /** @enum {string} */
            method: "EXPERIMENTAL_maintenance_windows";
            params: components["schemas"]["RpcMaintenanceWindowsRequest"];
        };
        /** JsonRpcRequest_for_EXPERIMENTAL_validators_ordered */
        JsonRpcRequest_for_EXPERIMENTAL_validators_ordered: {
            id: string;
            jsonrpc: string;
            /** @enum {string} */
            method: "EXPERIMENTAL_validators_ordered";
            params: components["schemas"]["RpcValidatorsOrderedRequest"];
        };
        /** JsonRpcRequest_for_health */
        JsonRpcRequest_for_health: {
            id: string;
            jsonrpc: string;
            /** @enum {string} */
            method: "health";
            params: components["schemas"]["RpcHealthRequest"];
        };
        /** JsonRpcResponse_for_Array_of_Range_of_uint64_and_RpcError */
        JsonRpcResponse_for_Array_of_Range_of_uint64_and_RpcError: {
            id: string;
            jsonrpc: string;
        } & ({
            result: components["schemas"]["Range_of_uint64"][];
        } | {
            error: components["schemas"]["RpcError"];
        });
        /** JsonRpcResponse_for_Array_of_ValidatorStakeView_and_RpcError */
        JsonRpcResponse_for_Array_of_ValidatorStakeView_and_RpcError: {
            id: string;
            jsonrpc: string;
        } & ({
            result: components["schemas"]["ValidatorStakeView"][];
        } | {
            error: components["schemas"]["RpcError"];
        });
        /** JsonRpcResponse_for_Nullable_RpcHealthResponse_and_RpcError */
        JsonRpcResponse_for_Nullable_RpcHealthResponse_and_RpcError: {
            id: string;
            jsonrpc: string;
        } & ({
            result: components["schemas"]["RpcHealthResponse"] | (null);
        } | {
            error: components["schemas"]["RpcError"];
        });
        /** JsonRpcResponse_for_RpcBlockResponse_and_RpcError */
        JsonRpcResponse_for_RpcBlockResponse_and_RpcError: {
            id: string;
            jsonrpc: string;
        } & ({
            result: components["schemas"]["RpcBlockResponse"];
        } | {
            error: components["schemas"]["RpcError"];
        });
        PublicKey: string;
        Range_of_uint64: {
            /** Format: uint64 */
            end: number;
            /** Format: uint64 */
            start: number;
        };
        /** RpcBlockRequest */
        RpcBlockRequest: {
            block_id: components["schemas"]["BlockId"];
        } | {
            finality: components["schemas"]["Finality"];
        } | {
            sync_checkpoint: components["schemas"]["SyncCheckpoint"];
        };
        RpcBlockResponse: {
            /** @description The AccountId of the author of the Block */
            author: components["schemas"]["AccountId"];
            chunks: components["schemas"]["ChunkHeaderView"][];
            header: components["schemas"]["BlockHeaderView"];
        };
        /** @description This struct may be returned from JSON RPC server in case of error
         *     It is expected that this struct has impl From<_> all other RPC errors
         *     like [RpcBlockError](crate::types::blocks::RpcBlockError) */
        RpcError: {
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
            cause: components["schemas"]["RpcRequestValidationErrorKind"];
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
        /**
         * RpcHealthRequest
         * @enum {unknown|null}
         */
        RpcHealthRequest: null;
        /** @enum {unknown|null} */
        RpcHealthResponse: null;
        /** RpcMaintenanceWindowsRequest */
        RpcMaintenanceWindowsRequest: {
            account_id: components["schemas"]["AccountId"];
        };
        RpcRequestValidationErrorKind: {
            info: {
                method_name: string;
            };
            /** @enum {string} */
            name: "METHOD_NOT_FOUND";
        } | {
            info: {
                error_message: string;
            };
            /** @enum {string} */
            name: "PARSE_ERROR";
        };
        /** RpcValidatorsOrderedRequest */
        RpcValidatorsOrderedRequest: {
            block_id?: components["schemas"]["BlockId"] | (null);
        };
        /**
         * Format: uint64
         * @description The shard identifier. It may be an arbitrary number - it does not need to be
         *     a number in the range 0..NUM_SHARDS. The shard ids do not need to be
         *     sequential or contiguous.
         *
         *     The shard id is wrapped in a new type to prevent the old pattern of using
         *     indices in range 0..NUM_SHARDS and casting to ShardId. Once the transition
         *     if fully complete it potentially may be simplified to a regular type alias.
         */
        ShardId: number;
        Signature: string;
        SlashedValidator: {
            account_id: components["schemas"]["AccountId"];
            is_double_sign: boolean;
        };
        /** @enum {string} */
        SyncCheckpoint: "genesis" | "earliest_available";
        ValidatorStakeView: {
            /** @enum {string} */
            validator_stake_struct_version: "V1";
        } & components["schemas"]["ValidatorStakeViewV1"];
        ValidatorStakeViewV1: {
            account_id: components["schemas"]["AccountId"];
            public_key: components["schemas"]["PublicKey"];
            stake: string;
        };
    };
    responses: never;
    parameters: never;
    requestBodies: never;
    headers: never;
    pathItems: never;
};
export type $defs = Record<string, never>;
export interface operations {
    block: {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["JsonRpcRequest_for_block"];
            };
        };
        responses: {
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["JsonRpcResponse_for_RpcBlockResponse_and_RpcError"];
                };
            };
        };
    };
    EXPERIMENTAL_maintenance_windows: {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["JsonRpcRequest_for_EXPERIMENTAL_maintenance_windows"];
            };
        };
        responses: {
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["JsonRpcResponse_for_Array_of_Range_of_uint64_and_RpcError"];
                };
            };
        };
    };
    EXPERIMENTAL_validators_ordered: {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["JsonRpcRequest_for_EXPERIMENTAL_validators_ordered"];
            };
        };
        responses: {
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["JsonRpcResponse_for_Array_of_ValidatorStakeView_and_RpcError"];
                };
            };
        };
    };
    health: {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["JsonRpcRequest_for_health"];
            };
        };
        responses: {
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["JsonRpcResponse_for_Nullable_RpcHealthResponse_and_RpcError"];
                };
            };
        };
    };
}
