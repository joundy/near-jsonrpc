/**
 * This file was auto-generated from @near-js/jsonrpc-generator.
 * It contains all the extracted types from openapi spec.
 */

export type AccessKey = {
            /**
             * Format: uint64
             * @description Nonce for this access key, used for tx nonce generation. When access key is created, nonce
             *      is set to `(block_height - 1) * 1e6` to avoid tx hash collision on access key re-creation.
             *      See <https://github.com/near/nearcore/issues/3779> for more details.
             */
            nonce: number;
            /** @description Defines permissions for this access key. */
            permission: AccessKeyPermission;
        } & {
            [key: string]: unknown;
        };
export type AccessKeyCreationConfigView = {
            /** @description Base cost of creating a full access access-key. */
            full_access_cost: Fee;
            /** @description Base cost of creating an access-key restricted to specific functions. */
            function_call_cost: Fee;
            /** @description Cost per byte of method_names of creating a restricted access-key. */
            function_call_cost_per_byte: Fee;
        } & {
            [key: string]: unknown;
        };
export type AccessKeyInfoView = {
            access_key: AccessKeyView;
            public_key: PublicKey;
        } & {
            [key: string]: unknown;
        };
export type AccessKeyList = {
            keys: AccessKeyInfoView[];
        } & {
            [key: string]: unknown;
        };
export type AccessKeyPermission = ({
            FunctionCall: FunctionCallPermission;
        } & {
            [key: string]: unknown;
        }) | "FullAccess";
export type AccessKeyPermissionView = "FullAccess" | ({
            FunctionCall: {
                allowance?: string | null;
                method_names: string[];
                receiver_id: string;
            } & {
                [key: string]: unknown;
            };
        } & {
            [key: string]: unknown;
        });
export type AccessKeyView = {
            /** Format: uint64 */
            nonce: number;
            permission: AccessKeyPermissionView;
        } & {
            [key: string]: unknown;
        };
export type AccountCreationConfigView = {
            /**
             * Format: uint8
             * @description The minimum length of the top-level account ID that is allowed to be created by any account.
             */
            min_allowed_top_level_account_length: number;
            /** @description The account ID of the account registrar. This account ID allowed to create top-level
             *      accounts of any valid length. */
            registrar_account_id: AccountId;
        } & {
            [key: string]: unknown;
        };
export type AccountDataView = {
            account_key: PublicKey;
            peer_id: PublicKey;
            proxies: Tier1ProxyView[];
            timestamp: string;
        } & {
            [key: string]: unknown;
        };
export type AccountId = string;
export type AccountIdValidityRulesVersion = number;
export type AccountInfo = {
            account_id: AccountId;
            amount: string;
            public_key: PublicKey;
        } & {
            [key: string]: unknown;
        };
export type AccountView = {
            amount: string;
            code_hash: CryptoHash;
            global_contract_account_id?: AccountId | null;
            global_contract_hash?: CryptoHash | null;
            locked: string;
            /**
             * Format: uint64
             * @description TODO(2271): deprecated.
             * @default 0
             */
            storage_paid_at: number;
            /** Format: uint64 */
            storage_usage: number;
        } & {
            [key: string]: unknown;
        };
export type AccountWithPublicKey = {
            account_id: AccountId;
            public_key: PublicKey;
        } & {
            [key: string]: unknown;
        };
export type Action = ({
            CreateAccount: CreateAccountAction;
        } & {
            [key: string]: unknown;
        }) | ({
            DeployContract: DeployContractAction;
        } & {
            [key: string]: unknown;
        }) | ({
            FunctionCall: FunctionCallAction;
        } & {
            [key: string]: unknown;
        }) | ({
            Transfer: TransferAction;
        } & {
            [key: string]: unknown;
        }) | ({
            Stake: StakeAction;
        } & {
            [key: string]: unknown;
        }) | ({
            AddKey: AddKeyAction;
        } & {
            [key: string]: unknown;
        }) | ({
            DeleteKey: DeleteKeyAction;
        } & {
            [key: string]: unknown;
        }) | ({
            DeleteAccount: DeleteAccountAction;
        } & {
            [key: string]: unknown;
        }) | ({
            Delegate: SignedDelegateAction;
        } & {
            [key: string]: unknown;
        }) | ({
            DeployGlobalContract: DeployGlobalContractAction;
        } & {
            [key: string]: unknown;
        }) | ({
            UseGlobalContract: UseGlobalContractAction;
        } & {
            [key: string]: unknown;
        });
export type ActionCreationConfigView = {
            /** @description Base cost of adding a key. */
            add_key_cost: AccessKeyCreationConfigView;
            /** @description Base cost of creating an account. */
            create_account_cost: Fee;
            /** @description Base cost for processing a delegate action.
             *
             *      This is on top of the costs for the actions inside the delegate action. */
            delegate_cost: Fee;
            /** @description Base cost of deleting an account. */
            delete_account_cost: Fee;
            /** @description Base cost of deleting a key. */
            delete_key_cost: Fee;
            /** @description Base cost of deploying a contract. */
            deploy_contract_cost: Fee;
            /** @description Cost per byte of deploying a contract. */
            deploy_contract_cost_per_byte: Fee;
            /** @description Base cost of calling a function. */
            function_call_cost: Fee;
            /** @description Cost per byte of method name and arguments of calling a function. */
            function_call_cost_per_byte: Fee;
            /** @description Base cost of staking. */
            stake_cost: Fee;
            /** @description Base cost of making a transfer. */
            transfer_cost: Fee;
        } & {
            [key: string]: unknown;
        };
export type ActionError = {
            /**
             * Format: uint64
             * @description Index of the failed action in the transaction.
             *      Action index is not defined if ActionError.kind is `ActionErrorKind::LackBalanceForState`
             */
            index?: number | null;
            /** @description The kind of ActionError happened */
            kind: ActionErrorKind;
        } & {
            [key: string]: unknown;
        };
export type ActionErrorKind = ({
            AccountAlreadyExists: {
                account_id: AccountId;
            } & {
                [key: string]: unknown;
            };
        } & {
            [key: string]: unknown;
        }) | ({
            AccountDoesNotExist: {
                account_id: AccountId;
            } & {
                [key: string]: unknown;
            };
        } & {
            [key: string]: unknown;
        }) | ({
            CreateAccountOnlyByRegistrar: {
                account_id: AccountId;
                predecessor_id: AccountId;
                registrar_account_id: AccountId;
            } & {
                [key: string]: unknown;
            };
        } & {
            [key: string]: unknown;
        }) | ({
            CreateAccountNotAllowed: {
                account_id: AccountId;
                predecessor_id: AccountId;
            } & {
                [key: string]: unknown;
            };
        } & {
            [key: string]: unknown;
        }) | ({
            ActorNoPermission: {
                account_id: AccountId;
                actor_id: AccountId;
            } & {
                [key: string]: unknown;
            };
        } & {
            [key: string]: unknown;
        }) | ({
            DeleteKeyDoesNotExist: {
                account_id: AccountId;
                public_key: PublicKey;
            } & {
                [key: string]: unknown;
            };
        } & {
            [key: string]: unknown;
        }) | ({
            AddKeyAlreadyExists: {
                account_id: AccountId;
                public_key: PublicKey;
            } & {
                [key: string]: unknown;
            };
        } & {
            [key: string]: unknown;
        }) | ({
            DeleteAccountStaking: {
                account_id: AccountId;
            } & {
                [key: string]: unknown;
            };
        } & {
            [key: string]: unknown;
        }) | ({
            LackBalanceForState: {
                /** @description An account which needs balance */
                account_id: AccountId;
                /** @description Balance required to complete an action. */
                amount: string;
            } & {
                [key: string]: unknown;
            };
        } & {
            [key: string]: unknown;
        }) | ({
            TriesToUnstake: {
                account_id: AccountId;
            } & {
                [key: string]: unknown;
            };
        } & {
            [key: string]: unknown;
        }) | ({
            TriesToStake: {
                account_id: AccountId;
                balance: string;
                locked: string;
                stake: string;
            } & {
                [key: string]: unknown;
            };
        } & {
            [key: string]: unknown;
        }) | ({
            InsufficientStake: {
                account_id: AccountId;
                minimum_stake: string;
                stake: string;
            } & {
                [key: string]: unknown;
            };
        } & {
            [key: string]: unknown;
        }) | ({
            FunctionCallError: FunctionCallError;
        } & {
            [key: string]: unknown;
        }) | ({
            NewReceiptValidationError: ReceiptValidationError;
        } & {
            [key: string]: unknown;
        }) | ({
            OnlyImplicitAccountCreationAllowed: {
                account_id: AccountId;
            } & {
                [key: string]: unknown;
            };
        } & {
            [key: string]: unknown;
        }) | ({
            DeleteAccountWithLargeState: {
                account_id: AccountId;
            } & {
                [key: string]: unknown;
            };
        } & {
            [key: string]: unknown;
        }) | "DelegateActionInvalidSignature" | ({
            DelegateActionSenderDoesNotMatchTxReceiver: {
                receiver_id: AccountId;
                sender_id: AccountId;
            } & {
                [key: string]: unknown;
            };
        } & {
            [key: string]: unknown;
        }) | "DelegateActionExpired" | ({
            DelegateActionAccessKeyError: InvalidAccessKeyError;
        } & {
            [key: string]: unknown;
        }) | ({
            DelegateActionInvalidNonce: {
                /** Format: uint64 */
                ak_nonce: number;
                /** Format: uint64 */
                delegate_nonce: number;
            } & {
                [key: string]: unknown;
            };
        } & {
            [key: string]: unknown;
        }) | ({
            DelegateActionNonceTooLarge: {
                /** Format: uint64 */
                delegate_nonce: number;
                /** Format: uint64 */
                upper_bound: number;
            } & {
                [key: string]: unknown;
            };
        } & {
            [key: string]: unknown;
        }) | ({
            GlobalContractDoesNotExist: {
                identifier: GlobalContractIdentifier;
            } & {
                [key: string]: unknown;
            };
        } & {
            [key: string]: unknown;
        });
export type ActionsValidationError = "DeleteActionMustBeFinal" | ({
            TotalPrepaidGasExceeded: {
                /** Format: uint64 */
                limit: number;
                /** Format: uint64 */
                total_prepaid_gas: number;
            } & {
                [key: string]: unknown;
            };
        } & {
            [key: string]: unknown;
        }) | ({
            TotalNumberOfActionsExceeded: {
                /** Format: uint64 */
                limit: number;
                /** Format: uint64 */
                total_number_of_actions: number;
            } & {
                [key: string]: unknown;
            };
        } & {
            [key: string]: unknown;
        }) | ({
            AddKeyMethodNamesNumberOfBytesExceeded: {
                /** Format: uint64 */
                limit: number;
                /** Format: uint64 */
                total_number_of_bytes: number;
            } & {
                [key: string]: unknown;
            };
        } & {
            [key: string]: unknown;
        }) | ({
            AddKeyMethodNameLengthExceeded: {
                /** Format: uint64 */
                length: number;
                /** Format: uint64 */
                limit: number;
            } & {
                [key: string]: unknown;
            };
        } & {
            [key: string]: unknown;
        }) | "IntegerOverflow" | ({
            InvalidAccountId: {
                account_id: string;
            } & {
                [key: string]: unknown;
            };
        } & {
            [key: string]: unknown;
        }) | ({
            ContractSizeExceeded: {
                /** Format: uint64 */
                limit: number;
                /** Format: uint64 */
                size: number;
            } & {
                [key: string]: unknown;
            };
        } & {
            [key: string]: unknown;
        }) | ({
            FunctionCallMethodNameLengthExceeded: {
                /** Format: uint64 */
                length: number;
                /** Format: uint64 */
                limit: number;
            } & {
                [key: string]: unknown;
            };
        } & {
            [key: string]: unknown;
        }) | ({
            FunctionCallArgumentsLengthExceeded: {
                /** Format: uint64 */
                length: number;
                /** Format: uint64 */
                limit: number;
            } & {
                [key: string]: unknown;
            };
        } & {
            [key: string]: unknown;
        }) | ({
            UnsuitableStakingKey: {
                public_key: PublicKey;
            } & {
                [key: string]: unknown;
            };
        } & {
            [key: string]: unknown;
        }) | "FunctionCallZeroAttachedGas" | "DelegateActionMustBeOnlyOne" | ({
            UnsupportedProtocolFeature: {
                protocol_feature: string;
                /** Format: uint32 */
                version: number;
            } & {
                [key: string]: unknown;
            };
        } & {
            [key: string]: unknown;
        });
export type ActionView = "CreateAccount" | ({
            DeployContract: {
                /** Format: bytes */
                code: string;
            } & {
                [key: string]: unknown;
            };
        } & {
            [key: string]: unknown;
        }) | ({
            FunctionCall: {
                /** Format: bytes */
                args: string;
                deposit: string;
                /** Format: uint64 */
                gas: number;
                method_name: string;
            } & {
                [key: string]: unknown;
            };
        } & {
            [key: string]: unknown;
        }) | ({
            Transfer: {
                deposit: string;
            } & {
                [key: string]: unknown;
            };
        } & {
            [key: string]: unknown;
        }) | ({
            Stake: {
                public_key: PublicKey;
                stake: string;
            } & {
                [key: string]: unknown;
            };
        } & {
            [key: string]: unknown;
        }) | ({
            AddKey: {
                access_key: AccessKeyView;
                public_key: PublicKey;
            } & {
                [key: string]: unknown;
            };
        } & {
            [key: string]: unknown;
        }) | ({
            DeleteKey: {
                public_key: PublicKey;
            } & {
                [key: string]: unknown;
            };
        } & {
            [key: string]: unknown;
        }) | ({
            DeleteAccount: {
                beneficiary_id: AccountId;
            } & {
                [key: string]: unknown;
            };
        } & {
            [key: string]: unknown;
        }) | ({
            Delegate: {
                delegate_action: DelegateAction;
                signature: Signature;
            } & {
                [key: string]: unknown;
            };
        } & {
            [key: string]: unknown;
        }) | ({
            DeployGlobalContract: {
                /** Format: bytes */
                code: string;
            } & {
                [key: string]: unknown;
            };
        } & {
            [key: string]: unknown;
        }) | ({
            DeployGlobalContractByAccountId: {
                /** Format: bytes */
                code: string;
            } & {
                [key: string]: unknown;
            };
        } & {
            [key: string]: unknown;
        }) | ({
            UseGlobalContract: {
                code_hash: CryptoHash;
            } & {
                [key: string]: unknown;
            };
        } & {
            [key: string]: unknown;
        }) | ({
            UseGlobalContractByAccountId: {
                account_id: AccountId;
            } & {
                [key: string]: unknown;
            };
        } & {
            [key: string]: unknown;
        });
export type AddKeyAction = {
            /** @description An access key with the permission */
            access_key: AccessKey;
            /** @description A public key which will be associated with an access_key */
            public_key: PublicKey;
        } & {
            [key: string]: unknown;
        };
export type BandwidthRequest = {
            /** @description Bitmap which describes what values of bandwidth are requested. */
            requested_values_bitmap: BandwidthRequestBitmap;
            /**
             * Format: uint16
             * @description Requesting bandwidth to this shard.
             */
            to_shard: number;
        } & {
            [key: string]: unknown;
        };
export type BandwidthRequestBitmap = {
            data: number[];
        } & {
            [key: string]: unknown;
        };
export type BandwidthRequests = {
            V1: BandwidthRequestsV1;
        } & {
            [key: string]: unknown;
        };
export type BandwidthRequestsV1 = {
            requests: BandwidthRequest[];
        } & {
            [key: string]: unknown;
        };
export type BlockHeaderInnerLiteView = {
            block_merkle_root: CryptoHash;
            epoch_id: CryptoHash;
            /** Format: uint64 */
            height: number;
            next_bp_hash: CryptoHash;
            next_epoch_id: CryptoHash;
            outcome_root: CryptoHash;
            prev_state_root: CryptoHash;
            /**
             * Format: uint64
             * @description Legacy json number. Should not be used.
             */
            timestamp: number;
            timestamp_nanosec: string;
        } & {
            [key: string]: unknown;
        };
export type BlockHeaderView = {
            approvals: (Signature | null)[];
            block_body_hash?: CryptoHash | null;
            block_merkle_root: CryptoHash;
            /** Format: uint64 */
            block_ordinal?: number | null;
            challenges_result: SlashedValidator[];
            challenges_root: CryptoHash;
            chunk_endorsements?: number[][] | null;
            chunk_headers_root: CryptoHash;
            chunk_mask: boolean[];
            chunk_receipts_root: CryptoHash;
            chunk_tx_root: CryptoHash;
            /** Format: uint64 */
            chunks_included: number;
            epoch_id: CryptoHash;
            epoch_sync_data_hash?: CryptoHash | null;
            gas_price: string;
            hash: CryptoHash;
            /** Format: uint64 */
            height: number;
            last_ds_final_block: CryptoHash;
            last_final_block: CryptoHash;
            /** Format: uint32 */
            latest_protocol_version: number;
            next_bp_hash: CryptoHash;
            next_epoch_id: CryptoHash;
            outcome_root: CryptoHash;
            prev_hash: CryptoHash;
            /** Format: uint64 */
            prev_height?: number | null;
            prev_state_root: CryptoHash;
            random_value: CryptoHash;
            /** @description TODO(2271): deprecated. */
            rent_paid: string;
            signature: Signature;
            /**
             * Format: uint64
             * @description Legacy json number. Should not be used.
             */
            timestamp: number;
            timestamp_nanosec: string;
            total_supply: string;
            validator_proposals: ValidatorStakeView[];
            /** @description TODO(2271): deprecated. */
            validator_reward: string;
        } & {
            [key: string]: unknown;
        };
export type BlockId = number | CryptoHash;
export type BlockStatusView = {
            hash: CryptoHash;
            /** Format: uint64 */
            height: number;
        } & {
            [key: string]: unknown;
        };
export type CallResult = {
            logs: string[];
            result: number[];
        } & {
            [key: string]: unknown;
        };
export type CatchupStatusView = {
            blocks_to_catchup: BlockStatusView[];
            shard_sync_status: {
                [key: string]: string;
            };
            sync_block_hash: CryptoHash;
            /** Format: uint64 */
            sync_block_height: number;
        } & {
            [key: string]: unknown;
        };
export type ChunkDistributionNetworkConfig = {
            enabled: boolean;
            uris: ChunkDistributionUris;
        } & {
            [key: string]: unknown;
        };
export type ChunkDistributionUris = {
            /** @description URI for pulling chunks from the stream. */
            get: string;
            /** @description URI for publishing chunks to the stream. */
            set: string;
        } & {
            [key: string]: unknown;
        };
export type ChunkHeaderView = {
            balance_burnt: string;
            bandwidth_requests?: BandwidthRequests | null;
            chunk_hash: CryptoHash;
            congestion_info?: CongestionInfoView | null;
            /** Format: uint64 */
            encoded_length: number;
            encoded_merkle_root: CryptoHash;
            /** Format: uint64 */
            gas_limit: number;
            /** Format: uint64 */
            gas_used: number;
            /** Format: uint64 */
            height_created: number;
            /** Format: uint64 */
            height_included: number;
            outcome_root: CryptoHash;
            outgoing_receipts_root: CryptoHash;
            prev_block_hash: CryptoHash;
            prev_state_root: CryptoHash;
            /** @description TODO(2271): deprecated. */
            rent_paid: string;
            shard_id: ShardId;
            signature: Signature;
            tx_root: CryptoHash;
            validator_proposals: ValidatorStakeView[];
            /** @description TODO(2271): deprecated. */
            validator_reward: string;
        } & {
            [key: string]: unknown;
        };
export type CompilationError = ({
            CodeDoesNotExist: {
                account_id: AccountId;
            } & {
                [key: string]: unknown;
            };
        } & {
            [key: string]: unknown;
        }) | ({
            PrepareError: PrepareError;
        } & {
            [key: string]: unknown;
        }) | ({
            WasmerCompileError: {
                msg: string;
            } & {
                [key: string]: unknown;
            };
        } & {
            [key: string]: unknown;
        });
export type CongestionControlConfigView = {
            /**
             * Format: uint64
             * @description How much gas the chosen allowed shard can send to a 100% congested shard.
             *
             *      See [`CongestionControlConfig`] for more details.
             */
            allowed_shard_outgoing_gas: number;
            /**
             * Format: uint64
             * @description How much gas in delayed receipts of a shard is 100% incoming congestion.
             *
             *      See [`CongestionControlConfig`] for more details.
             */
            max_congestion_incoming_gas: number;
            /**
             * Format: uint64
             * @description How much memory space of all delayed and buffered receipts in a shard is
             *      considered 100% congested.
             *
             *      See [`CongestionControlConfig`] for more details.
             */
            max_congestion_memory_consumption: number;
            /**
             * Format: uint64
             * @description How many missed chunks in a row in a shard is considered 100% congested.
             */
            max_congestion_missed_chunks: number;
            /**
             * Format: uint64
             * @description How much gas in outgoing buffered receipts of a shard is 100% congested.
             *
             *      Outgoing congestion contributes to overall congestion, which reduces how
             *      much other shards are allowed to forward to this shard.
             */
            max_congestion_outgoing_gas: number;
            /**
             * Format: uint64
             * @description The maximum amount of gas attached to receipts a shard can forward to
             *      another shard per chunk.
             *
             *      See [`CongestionControlConfig`] for more details.
             */
            max_outgoing_gas: number;
            /**
             * Format: uint64
             * @description The maximum amount of gas in a chunk spent on converting new transactions to
             *      receipts.
             *
             *      See [`CongestionControlConfig`] for more details.
             */
            max_tx_gas: number;
            /**
             * Format: uint64
             * @description The minimum gas each shard can send to a shard that is not fully congested.
             *
             *      See [`CongestionControlConfig`] for more details.
             */
            min_outgoing_gas: number;
            /**
             * Format: uint64
             * @description The minimum amount of gas in a chunk spent on converting new transactions
             *      to receipts, as long as the receiving shard is not congested.
             *
             *      See [`CongestionControlConfig`] for more details.
             */
            min_tx_gas: number;
            /**
             * Format: uint64
             * @description Large size limit for outgoing receipts to a shard, used when it's safe
             *      to send a lot of receipts without making the state witness too large.
             *      It limits the total sum of outgoing receipts, not individual receipts.
             */
            outgoing_receipts_big_size_limit: number;
            /**
             * Format: uint64
             * @description The standard size limit for outgoing receipts aimed at a single shard.
             *      This limit is pretty small to keep the size of source_receipt_proofs under control.
             *      It limits the total sum of outgoing receipts, not individual receipts.
             */
            outgoing_receipts_usual_size_limit: number;
            /**
             * Format: double
             * @description How much congestion a shard can tolerate before it stops all shards from
             *      accepting new transactions with the receiver set to the congested shard.
             */
            reject_tx_congestion_threshold: number;
        } & {
            [key: string]: unknown;
        };
export type CongestionInfoView = {
            /** Format: uint16 */
            allowed_shard: number;
            buffered_receipts_gas: string;
            delayed_receipts_gas: string;
            /** Format: uint64 */
            receipt_bytes: number;
        } & {
            [key: string]: unknown;
        };
export type ContractCodeView = {
            code_base64: string;
            hash: CryptoHash;
        } & {
            [key: string]: unknown;
        };
export type CostGasUsed = {
            cost: string;
            cost_category: string;
            gas_used: string;
        } & {
            [key: string]: unknown;
        };
export type CreateAccountAction = Record<string, unknown>;
export type CryptoHash = string;
export type CurrentEpochValidatorInfo = {
            account_id: AccountId;
            is_slashed: boolean;
            /** Format: uint64 */
            num_expected_blocks: number;
            /**
             * Format: uint64
             * @default 0
             */
            num_expected_chunks: number;
            /**
             * @description Number of chunks this validator was expected to produce in each shard.
             *      Each entry in the array corresponds to the shard in the `shards_produced` array.
             * @default []
             */
            num_expected_chunks_per_shard: number[];
            /**
             * Format: uint64
             * @default 0
             */
            num_expected_endorsements: number;
            /**
             * @description Number of chunks this validator was expected to validate and endorse in each shard.
             *      Each entry in the array corresponds to the shard in the `shards_endorsed` array.
             * @default []
             */
            num_expected_endorsements_per_shard: number[];
            /** Format: uint64 */
            num_produced_blocks: number;
            /**
             * Format: uint64
             * @default 0
             */
            num_produced_chunks: number;
            /** @default [] */
            num_produced_chunks_per_shard: number[];
            /**
             * Format: uint64
             * @default 0
             */
            num_produced_endorsements: number;
            /** @default [] */
            num_produced_endorsements_per_shard: number[];
            public_key: PublicKey;
            /** @description Shards this validator is assigned to as chunk producer in the current epoch. */
            shards: ShardId[];
            /**
             * @description Shards this validator is assigned to as chunk validator in the current epoch.
             * @default []
             */
            shards_endorsed: ShardId[];
            stake: string;
        } & {
            [key: string]: unknown;
        };
export type DataReceiptCreationConfigView = {
            /** @description Base cost of creating a data receipt.
             *      Both `send` and `exec` costs are burned when a new receipt has input dependencies. The gas
             *      is charged for each input dependency. The dependencies are specified when a receipt is
             *      created using `promise_then` and `promise_batch_then`.
             *      NOTE: Any receipt with output dependencies will produce data receipts. Even if it fails.
             *      Even if the last action is not a function call (in case of success it will return empty
             *      value). */
            base_cost: Fee;
            /** @description Additional cost per byte sent.
             *      Both `send` and `exec` costs are burned when a function call finishes execution and returns
             *      `N` bytes of data to every output dependency. For each output dependency the cost is
             *      `(send(sir) + exec()) * N`. */
            cost_per_byte: Fee;
        } & {
            [key: string]: unknown;
        };
export type DataReceiverView = {
            data_id: CryptoHash;
            receiver_id: AccountId;
        } & {
            [key: string]: unknown;
        };
export type DelegateAction = {
            /** @description List of actions to be executed.
             *
             *      With the meta transactions MVP defined in NEP-366, nested
             *      DelegateActions are not allowed. A separate type is used to enforce it. */
            actions: NonDelegateAction[];
            /**
             * Format: uint64
             * @description The maximal height of the block in the blockchain below which the given DelegateAction is valid.
             */
            max_block_height: number;
            /**
             * Format: uint64
             * @description Nonce to ensure that the same delegate action is not sent twice by a
             *      relayer and should match for given account's `public_key`.
             *      After this action is processed it will increment.
             */
            nonce: number;
            /** @description Public key used to sign this delegated action. */
            public_key: PublicKey;
            /** @description Receiver of the delegated actions. */
            receiver_id: AccountId;
            /** @description Signer of the delegated actions */
            sender_id: AccountId;
        } & {
            [key: string]: unknown;
        };
export type DeleteAccountAction = {
            beneficiary_id: AccountId;
        } & {
            [key: string]: unknown;
        };
export type DeleteKeyAction = {
            /** @description A public key associated with the access_key to be deleted. */
            public_key: PublicKey;
        } & {
            [key: string]: unknown;
        };
export type DeployContractAction = {
            /** @description WebAssembly binary */
            code: string;
        } & {
            [key: string]: unknown;
        };
export type DeployGlobalContractAction = {
            /** @description WebAssembly binary */
            code: string;
            deploy_mode: GlobalContractDeployMode;
        } & {
            [key: string]: unknown;
        };
export type DetailedDebugStatus = {
            /** Format: uint64 */
            block_production_delay_millis: number;
            catchup_status: CatchupStatusView[];
            current_head_status: BlockStatusView;
            current_header_head_status: BlockStatusView;
            network_info: NetworkInfoView;
            sync_status: string;
        } & {
            [key: string]: unknown;
        };
export type Direction = "Left" | "Right";
export type DumpConfig = {
            /** @description Location of a json file with credentials allowing write access to the bucket. */
            credentials_file?: string | null;
            /** @description How often to check if a new epoch has started.
             *      Feel free to set to `None`, defaults are sensible. */
            iteration_delay?: DurationAsStdSchemaProvider | null;
            /** @description Specifies where to write the obtained state parts. */
            location: ExternalStorageLocation;
            /** @description Use in case a node that dumps state to the external storage
             *      gets in trouble. */
            restart_dump_for_shards?: ShardId[] | null;
        } & {
            [key: string]: unknown;
        };
export type DurationAsStdSchemaProvider = {
            /** Format: int32 */
            nanos: number;
            /** Format: int64 */
            secs: number;
        } & {
            [key: string]: unknown;
        };
export type EpochId = CryptoHash;
export type EpochSyncConfig = {
            /**
             * @description If true, even if the node started from genesis, it will not perform epoch sync.
             *      There should be no reason to set this flag in production, because on both mainnet
             *      and testnet it would be infeasible to catch up from genesis without epoch sync.
             * @default false
             */
            disable_epoch_sync_for_bootstrapping: boolean;
            /**
             * Format: uint64
             * @description This serves as two purposes: (1) the node will not epoch sync and instead resort to
             *      header sync, if the genesis block is within this many blocks from the current block;
             *      (2) the node will reject an epoch sync proof if the provided proof is for an epoch
             *      that is more than this many blocks behind the current block.
             */
            epoch_sync_horizon: number;
            /**
             * @description If true, the node will ignore epoch sync requests from the network. It is strongly
             *      recommended not to set this flag, because it will prevent other nodes from
             *      bootstrapping. This flag is only included as a kill-switch and may be removed in a
             *      future release. Please note that epoch sync requests are heavily rate limited and
             *      cached, and therefore should not affect the performance of the node or introduce
             *      any non-negligible increase in network traffic.
             * @default false
             */
            ignore_epoch_sync_network_requests: boolean;
            /** @description Timeout for epoch sync requests. The node will continue retrying indefinitely even
             *      if this timeout is exceeded. */
            timeout_for_epoch_sync: DurationAsStdSchemaProvider;
        } & {
            [key: string]: unknown;
        };
export type ExecutionMetadataView = {
            gas_profile?: CostGasUsed[] | null;
            /** Format: uint32 */
            version: number;
        } & {
            [key: string]: unknown;
        };
export type ExecutionOutcomeView = {
            /** @description The id of the account on which the execution happens. For transaction this is signer_id,
             *      for receipt this is receiver_id. */
            executor_id: AccountId;
            /**
             * Format: uint64
             * @description The amount of the gas burnt by the given transaction or receipt.
             */
            gas_burnt: number;
            /** @description Logs from this transaction or receipt. */
            logs: string[];
            /**
             * @description Execution metadata, versioned
             * @default {
             *       "version": 1
             *     }
             */
            metadata: ExecutionMetadataView;
            /** @description Receipt IDs generated by this transaction or receipt. */
            receipt_ids: CryptoHash[];
            /** @description Execution status. Contains the result in case of successful execution. */
            status: ExecutionStatusView;
            /** @description The amount of tokens burnt corresponding to the burnt gas amount.
             *      This value doesn't always equal to the `gas_burnt` multiplied by the gas price, because
             *      the prepaid gas price might be lower than the actual gas price and it creates a deficit.
             *      `tokens_burnt` also contains the penalty subtracted from refunds, while
             *      `gas_burnt` only contains the gas that we actually burn for the execution. */
            tokens_burnt: string;
        } & {
            [key: string]: unknown;
        };
export type ExecutionOutcomeWithIdView = {
            block_hash: CryptoHash;
            id: CryptoHash;
            outcome: ExecutionOutcomeView;
            proof: MerklePathItem[];
        } & {
            [key: string]: unknown;
        };
export type ExecutionStatusView = "Unknown" | ({
            Failure: TxExecutionError;
        } & {
            [key: string]: unknown;
        }) | ({
            SuccessValue: string;
        } & {
            [key: string]: unknown;
        }) | ({
            SuccessReceiptId: CryptoHash;
        } & {
            [key: string]: unknown;
        });
export type ExtCostsConfigView = {
            /**
             * Format: uint64
             * @description Base cost for multiexp
             */
            alt_bn128_g1_multiexp_base: number;
            /**
             * Format: uint64
             * @description Per element cost for multiexp
             */
            alt_bn128_g1_multiexp_element: number;
            /**
             * Format: uint64
             * @description Base cost for sum
             */
            alt_bn128_g1_sum_base: number;
            /**
             * Format: uint64
             * @description Per element cost for sum
             */
            alt_bn128_g1_sum_element: number;
            /**
             * Format: uint64
             * @description Base cost for pairing check
             */
            alt_bn128_pairing_check_base: number;
            /**
             * Format: uint64
             * @description Per element cost for pairing check
             */
            alt_bn128_pairing_check_element: number;
            /**
             * Format: uint64
             * @description Base cost for calling a host function.
             */
            base: number;
            /** Format: uint64 */
            bls12381_g1_multiexp_base: number;
            /** Format: uint64 */
            bls12381_g1_multiexp_element: number;
            /** Format: uint64 */
            bls12381_g2_multiexp_base: number;
            /** Format: uint64 */
            bls12381_g2_multiexp_element: number;
            /** Format: uint64 */
            bls12381_map_fp_to_g1_base: number;
            /** Format: uint64 */
            bls12381_map_fp_to_g1_element: number;
            /** Format: uint64 */
            bls12381_map_fp2_to_g2_base: number;
            /** Format: uint64 */
            bls12381_map_fp2_to_g2_element: number;
            /** Format: uint64 */
            bls12381_p1_decompress_base: number;
            /** Format: uint64 */
            bls12381_p1_decompress_element: number;
            /** Format: uint64 */
            bls12381_p1_sum_base: number;
            /** Format: uint64 */
            bls12381_p1_sum_element: number;
            /** Format: uint64 */
            bls12381_p2_decompress_base: number;
            /** Format: uint64 */
            bls12381_p2_decompress_element: number;
            /** Format: uint64 */
            bls12381_p2_sum_base: number;
            /** Format: uint64 */
            bls12381_p2_sum_element: number;
            /** Format: uint64 */
            bls12381_pairing_base: number;
            /** Format: uint64 */
            bls12381_pairing_element: number;
            /** Format: uint64 */
            contract_compile_base: number;
            /** Format: uint64 */
            contract_compile_bytes: number;
            /**
             * Format: uint64
             * @description Base cost of loading a pre-compiled contract
             */
            contract_loading_base: number;
            /**
             * Format: uint64
             * @description Cost per byte of loading a pre-compiled contract
             */
            contract_loading_bytes: number;
            /**
             * Format: uint64
             * @description Cost of calling ecrecover
             */
            ecrecover_base: number;
            /**
             * Format: uint64
             * @description Cost of getting ed25519 base
             */
            ed25519_verify_base: number;
            /**
             * Format: uint64
             * @description Cost of getting ed25519 per byte
             */
            ed25519_verify_byte: number;
            /**
             * Format: uint64
             * @description Cost of getting sha256 base
             */
            keccak256_base: number;
            /**
             * Format: uint64
             * @description Cost of getting sha256 per byte
             */
            keccak256_byte: number;
            /**
             * Format: uint64
             * @description Cost of getting sha256 base
             */
            keccak512_base: number;
            /**
             * Format: uint64
             * @description Cost of getting sha256 per byte
             */
            keccak512_byte: number;
            /**
             * Format: uint64
             * @description Cost for calling logging.
             */
            log_base: number;
            /**
             * Format: uint64
             * @description Cost for logging per byte
             */
            log_byte: number;
            /**
             * Format: uint64
             * @description Cost for calling `promise_and`
             */
            promise_and_base: number;
            /**
             * Format: uint64
             * @description Cost for calling `promise_and` for each promise
             */
            promise_and_per_promise: number;
            /**
             * Format: uint64
             * @description Cost for calling `promise_return`
             */
            promise_return: number;
            /**
             * Format: uint64
             * @description Cost for reading trie node from memory
             */
            read_cached_trie_node: number;
            /**
             * Format: uint64
             * @description Base cost for guest memory read
             */
            read_memory_base: number;
            /**
             * Format: uint64
             * @description Cost for guest memory read
             */
            read_memory_byte: number;
            /**
             * Format: uint64
             * @description Base cost for reading from register
             */
            read_register_base: number;
            /**
             * Format: uint64
             * @description Cost for reading byte from register
             */
            read_register_byte: number;
            /**
             * Format: uint64
             * @description Cost of getting ripemd160 base
             */
            ripemd160_base: number;
            /**
             * Format: uint64
             * @description Cost of getting ripemd160 per message block
             */
            ripemd160_block: number;
            /**
             * Format: uint64
             * @description Cost of getting sha256 base
             */
            sha256_base: number;
            /**
             * Format: uint64
             * @description Cost of getting sha256 per byte
             */
            sha256_byte: number;
            /**
             * Format: uint64
             * @description Storage trie check for key existence cost base
             */
            storage_has_key_base: number;
            /**
             * Format: uint64
             * @description Storage trie check for key existence per key byte
             */
            storage_has_key_byte: number;
            /**
             * Format: uint64
             * @description Create trie range iterator cost per byte of from key.
             */
            storage_iter_create_from_byte: number;
            /**
             * Format: uint64
             * @description Create trie prefix iterator cost base
             */
            storage_iter_create_prefix_base: number;
            /**
             * Format: uint64
             * @description Create trie prefix iterator cost per byte.
             */
            storage_iter_create_prefix_byte: number;
            /**
             * Format: uint64
             * @description Create trie range iterator cost base
             */
            storage_iter_create_range_base: number;
            /**
             * Format: uint64
             * @description Create trie range iterator cost per byte of to key.
             */
            storage_iter_create_to_byte: number;
            /**
             * Format: uint64
             * @description Trie iterator per key base cost
             */
            storage_iter_next_base: number;
            /**
             * Format: uint64
             * @description Trie iterator next key byte cost
             */
            storage_iter_next_key_byte: number;
            /**
             * Format: uint64
             * @description Trie iterator next key byte cost
             */
            storage_iter_next_value_byte: number;
            /**
             * Format: uint64
             * @description Storage trie read key overhead base cost, when doing large reads
             */
            storage_large_read_overhead_base: number;
            /**
             * Format: uint64
             * @description Storage trie read key overhead  per-byte cost, when doing large reads
             */
            storage_large_read_overhead_byte: number;
            /**
             * Format: uint64
             * @description Storage trie read key base cost
             */
            storage_read_base: number;
            /**
             * Format: uint64
             * @description Storage trie read key per byte cost
             */
            storage_read_key_byte: number;
            /**
             * Format: uint64
             * @description Storage trie read value cost per byte cost
             */
            storage_read_value_byte: number;
            /**
             * Format: uint64
             * @description Remove key from trie base cost
             */
            storage_remove_base: number;
            /**
             * Format: uint64
             * @description Remove key from trie per byte cost
             */
            storage_remove_key_byte: number;
            /**
             * Format: uint64
             * @description Remove key from trie ret value byte cost
             */
            storage_remove_ret_value_byte: number;
            /**
             * Format: uint64
             * @description Storage trie write key base cost
             */
            storage_write_base: number;
            /**
             * Format: uint64
             * @description Storage trie write cost per byte of evicted value.
             */
            storage_write_evicted_byte: number;
            /**
             * Format: uint64
             * @description Storage trie write key per byte cost
             */
            storage_write_key_byte: number;
            /**
             * Format: uint64
             * @description Storage trie write value per byte cost
             */
            storage_write_value_byte: number;
            /**
             * Format: uint64
             * @description Cost per reading trie node from DB
             */
            touching_trie_node: number;
            /**
             * Format: uint64
             * @description Base cost of decoding utf8. It's used for `log_utf8` and `panic_utf8`.
             */
            utf8_decoding_base: number;
            /**
             * Format: uint64
             * @description Cost per byte of decoding utf8. It's used for `log_utf8` and `panic_utf8`.
             */
            utf8_decoding_byte: number;
            /**
             * Format: uint64
             * @description Base cost of decoding utf16. It's used for `log_utf16`.
             */
            utf16_decoding_base: number;
            /**
             * Format: uint64
             * @description Cost per byte of decoding utf16. It's used for `log_utf16`.
             */
            utf16_decoding_byte: number;
            /**
             * Format: uint64
             * @description Cost of calling `validator_stake`.
             */
            validator_stake_base: number;
            /**
             * Format: uint64
             * @description Cost of calling `validator_total_stake`.
             */
            validator_total_stake_base: number;
            /**
             * Format: uint64
             * @description Base cost for guest memory write
             */
            write_memory_base: number;
            /**
             * Format: uint64
             * @description Cost for guest memory write per byte
             */
            write_memory_byte: number;
            /**
             * Format: uint64
             * @description Base cost for writing into register
             */
            write_register_base: number;
            /**
             * Format: uint64
             * @description Cost for writing byte into register
             */
            write_register_byte: number;
            /**
             * Format: uint64
             * @description Base cost for creating a yield promise.
             */
            yield_create_base: number;
            /**
             * Format: uint64
             * @description Per byte cost of arguments and method name.
             */
            yield_create_byte: number;
            /**
             * Format: uint64
             * @description Base cost for resuming a yield receipt.
             */
            yield_resume_base: number;
            /**
             * Format: uint64
             * @description Per byte cost of resume payload.
             */
            yield_resume_byte: number;
        } & {
            [key: string]: unknown;
        };
export type ExternalStorageConfig = {
            /**
             * Format: uint64
             * @description The number of attempts the node will make to obtain a part from peers in
             *      the network before it fetches from external storage.
             * @default 3
             */
            external_storage_fallback_threshold: number;
            /** @description Location of state parts. */
            location: ExternalStorageLocation;
            /**
             * Format: uint8
             * @description When fetching state parts from external storage, throttle fetch requests
             *      to this many concurrent requests.
             * @default 25
             */
            num_concurrent_requests: number;
            /**
             * Format: uint8
             * @description During catchup, the node will use a different number of concurrent requests
             *      to reduce the performance impact of state sync.
             * @default 5
             */
            num_concurrent_requests_during_catchup: number;
        } & {
            [key: string]: unknown;
        };
export type ExternalStorageLocation = ({
            S3: {
                /** @description Location of state dumps on S3. */
                bucket: string;
                /** @description Data may only be available in certain locations. */
                region: string;
            } & {
                [key: string]: unknown;
            };
        } & {
            [key: string]: unknown;
        }) | ({
            Filesystem: {
                root_dir: string;
            } & {
                [key: string]: unknown;
            };
        } & {
            [key: string]: unknown;
        }) | ({
            GCS: {
                bucket: string;
            } & {
                [key: string]: unknown;
            };
        } & {
            [key: string]: unknown;
        });
export type Fee = {
            /**
             * Format: uint64
             * @description Fee for executing the object.
             */
            execution: number;
            /**
             * Format: uint64
             * @description Fee for sending an object potentially across the shards.
             */
            send_not_sir: number;
            /**
             * Format: uint64
             * @description Fee for sending an object from the sender to itself, guaranteeing that it does not leave
             *      the shard.
             */
            send_sir: number;
        } & {
            [key: string]: unknown;
        };
export type FinalExecutionOutcomeView = {
            /** @description The execution outcome of receipts. */
            receipts_outcome: ExecutionOutcomeWithIdView[];
            /** @description Execution status defined by chain.rs:get_final_transaction_result
             *      FinalExecutionStatus::NotStarted - the tx is not converted to the receipt yet
             *      FinalExecutionStatus::Started - we have at least 1 receipt, but the first leaf receipt_id (using dfs) hasn't finished the execution
             *      FinalExecutionStatus::Failure - the result of the first leaf receipt_id
             *      FinalExecutionStatus::SuccessValue - the result of the first leaf receipt_id */
            status: FinalExecutionStatus;
            /** @description Signed Transaction */
            transaction: SignedTransactionView;
            /** @description The execution outcome of the signed transaction. */
            transaction_outcome: ExecutionOutcomeWithIdView;
        } & {
            [key: string]: unknown;
        };
export type FinalExecutionOutcomeWithReceiptView = {
            /** @description Receipts generated from the transaction */
            receipts: ReceiptView[];
            /** @description The execution outcome of receipts. */
            receipts_outcome: ExecutionOutcomeWithIdView[];
            /** @description Execution status defined by chain.rs:get_final_transaction_result
             *      FinalExecutionStatus::NotStarted - the tx is not converted to the receipt yet
             *      FinalExecutionStatus::Started - we have at least 1 receipt, but the first leaf receipt_id (using dfs) hasn't finished the execution
             *      FinalExecutionStatus::Failure - the result of the first leaf receipt_id
             *      FinalExecutionStatus::SuccessValue - the result of the first leaf receipt_id */
            status: FinalExecutionStatus;
            /** @description Signed Transaction */
            transaction: SignedTransactionView;
            /** @description The execution outcome of the signed transaction. */
            transaction_outcome: ExecutionOutcomeWithIdView;
        } & {
            [key: string]: unknown;
        };
export type FinalExecutionStatus = "NotStarted" | "Started" | ({
            Failure: TxExecutionError;
        } & {
            [key: string]: unknown;
        }) | ({
            SuccessValue: string;
        } & {
            [key: string]: unknown;
        });
export type Finality = "optimistic" | "near-final" | "final";
export type FunctionCallAction = {
            args: string;
            deposit: string;
            /** Format: uint64 */
            gas: number;
            method_name: string;
        } & {
            [key: string]: unknown;
        };
export type FunctionCallError = ("WasmUnknownError" | "_EVMError") | ({
            CompilationError: CompilationError;
        } & {
            [key: string]: unknown;
        }) | ({
            LinkError: {
                msg: string;
            } & {
                [key: string]: unknown;
            };
        } & {
            [key: string]: unknown;
        }) | ({
            MethodResolveError: MethodResolveError;
        } & {
            [key: string]: unknown;
        }) | ({
            WasmTrap: WasmTrap;
        } & {
            [key: string]: unknown;
        }) | ({
            HostError: HostError;
        } & {
            [key: string]: unknown;
        }) | ({
            ExecutionError: string;
        } & {
            [key: string]: unknown;
        });
export type FunctionCallPermission = {
            /** @description Allowance is a balance limit to use by this access key to pay for function call gas and
             *      transaction fees. When this access key is used, both account balance and the allowance is
             *      decreased by the same value.
             *      `None` means unlimited allowance.
             *      NOTE: To change or increase the allowance, the old access key needs to be deleted and a new
             *      access key should be created. */
            allowance?: string | null;
            /** @description A list of method names that can be used. The access key only allows transactions with the
             *      function call of one of the given method names.
             *      Empty list means any method name can be used. */
            method_names: string[];
            /** @description The access key only allows transactions with the given receiver's account id. */
            receiver_id: string;
        } & {
            [key: string]: unknown;
        };
export type GasKeyView = {
            /** Format: uint128 */
            balance: number;
            /** Format: uint32 */
            num_nonces: number;
            permission: AccessKeyPermissionView;
        } & {
            [key: string]: unknown;
        };
export type GCConfig = {
            /**
             * Format: uint64
             * @description Maximum number of blocks to garbage collect at every garbage collection
             *      call.
             * @default 2
             */
            gc_blocks_limit: number;
            /**
             * Format: uint64
             * @description Maximum number of height to go through at each garbage collection step
             *      when cleaning forks during garbage collection.
             * @default 100
             */
            gc_fork_clean_step: number;
            /**
             * Format: uint64
             * @description Number of epochs for which we keep store data.
             * @default 5
             */
            gc_num_epochs_to_keep: number;
            /**
             * @description How often gc should be run
             * @default {
             *       "nanos": 500000000,
             *       "secs": 0
             *     }
             */
            gc_step_period: DurationAsStdSchemaProvider;
        } & {
            [key: string]: unknown;
        };
export type GenesisConfig = {
            /** @description Expected number of hidden validators per shard. */
            avg_hidden_validator_seats_per_shard: number[];
            /**
             * Format: uint8
             * @description Threshold for kicking out block producers, between 0 and 100.
             */
            block_producer_kickout_threshold: number;
            /** @description ID of the blockchain. This must be unique for every blockchain.
             *      If your testnet blockchains do not have unique chain IDs, you will have a bad time. */
            chain_id: string;
            /**
             * Format: uint64
             * @description Limits the number of shard changes in chunk producer assignments,
             *      if algorithm is able to choose assignment with better balance of
             *      number of chunk producers for shards.
             * @default 5
             */
            chunk_producer_assignment_changes_limit: number;
            /**
             * Format: uint8
             * @description Threshold for kicking out chunk producers, between 0 and 100.
             */
            chunk_producer_kickout_threshold: number;
            /**
             * Format: uint8
             * @description Threshold for kicking out nodes which are only chunk validators, between 0 and 100.
             * @default 80
             */
            chunk_validator_only_kickout_threshold: number;
            /** @description Enable dynamic re-sharding. */
            dynamic_resharding: boolean;
            /**
             * Format: uint64
             * @description Epoch length counted in block heights.
             */
            epoch_length: number;
            /** @description Fishermen stake threshold. */
            fishermen_threshold: string;
            /**
             * Format: uint64
             * @description Initial gas limit.
             */
            gas_limit: number;
            /** @description Gas price adjustment rate */
            gas_price_adjustment_rate: number[];
            /**
             * Format: uint64
             * @description Height of genesis block.
             */
            genesis_height: number;
            /**
             * Format: date-time
             * @description Official time of blockchain start.
             */
            genesis_time: string;
            max_gas_price: string;
            /** @description Maximum inflation on the total supply every epoch. */
            max_inflation_rate: number[];
            /**
             * Format: uint8
             * @description Max stake percentage of the validators we will kick out.
             * @default 100
             */
            max_kickout_stake_perc: number;
            /** @description Minimum gas price. It is also the initial gas price. */
            min_gas_price: string;
            /**
             * Format: uint64
             * @description The minimum stake required for staking is last seat price divided by this number.
             * @default 10
             */
            minimum_stake_divisor: number;
            /**
             * @description The lowest ratio s/s_total any block producer can have.
             *      See <https://github.com/near/NEPs/pull/167> for details
             * @default [
             *       1,
             *       6250
             *     ]
             */
            minimum_stake_ratio: number[];
            /**
             * Format: uint64
             * @description The minimum number of validators each shard must have
             * @default 1
             */
            minimum_validators_per_shard: number;
            /**
             * Format: uint64
             * @description Number of block producer seats at genesis.
             */
            num_block_producer_seats: number;
            /** @description Defines number of shards and number of block producer seats per each shard at genesis.
             *      Note: not used with protocol_feature_chunk_only_producers -- replaced by minimum_validators_per_shard
             *      Note: not used before as all block producers produce chunks for all shards */
            num_block_producer_seats_per_shard: number[];
            /**
             * Format: uint64
             * @description Expected number of blocks per year
             */
            num_blocks_per_year: number;
            /**
             * Format: uint64
             * @description Deprecated.
             * @default 300
             */
            num_chunk_only_producer_seats: number;
            /**
             * Format: uint64
             * @description Number of chunk producers.
             *      Don't mess it up with chunk-only producers feature which is deprecated.
             * @default 100
             */
            num_chunk_producer_seats: number;
            /**
             * Format: uint64
             * @default 300
             */
            num_chunk_validator_seats: number;
            /**
             * @description Online maximum threshold above which validator gets full reward.
             * @default [
             *       99,
             *       100
             *     ]
             */
            online_max_threshold: number[];
            /**
             * @description Online minimum threshold below which validator doesn't receive reward.
             * @default [
             *       9,
             *       10
             *     ]
             */
            online_min_threshold: number[];
            /** @description Protocol treasury rate */
            protocol_reward_rate: number[];
            /** @description Protocol treasury account */
            protocol_treasury_account: AccountId;
            /**
             * @description Threshold of stake that needs to indicate that they ready for upgrade.
             * @default [
             *       4,
             *       5
             *     ]
             */
            protocol_upgrade_stake_threshold: number[];
            /**
             * Format: uint32
             * @description Protocol version that this genesis works with.
             */
            protocol_version: number;
            /**
             * @description Layout information regarding how to split accounts to shards
             * @default {
             *       "V2": {
             *         "boundary_accounts": [],
             *         "id_to_index_map": {
             *           "0": 0
             *         },
             *         "index_to_id_map": {
             *           "0": 0
             *         },
             *         "shard_ids": [
             *           0
             *         ],
             *         "shards_parent_map": null,
             *         "shards_split_map": null,
             *         "version": 0
             *       }
             *     }
             */
            shard_layout: ShardLayout;
            /**
             * @description If true, shuffle the chunk producers across shards. In other words, if
             *      the shard assignments were `[S_0, S_1, S_2, S_3]` where `S_i` represents
             *      the set of chunk producers for shard `i`, if this flag were true, the
             *      shard assignments might become, for example, `[S_2, S_0, S_3, S_1]`.
             * @default false
             */
            shuffle_shard_assignment_for_chunk_producers: boolean;
            /**
             * Format: uint64
             * @description Number of target chunk validator mandates for each shard.
             * @default 68
             */
            target_validator_mandates_per_shard: number;
            /** @description Total supply of tokens at genesis. */
            total_supply: string;
            /**
             * Format: uint64
             * @description Number of blocks for which a given transaction is valid
             */
            transaction_validity_period: number;
            /**
             * @description This is only for test purposes. We hard code some configs for mainnet and testnet
             *      in AllEpochConfig, and we want to have a way to test that code path. This flag is for that.
             *      If set to true, the node will use the same config override path as mainnet and testnet.
             * @default false
             */
            use_production_config: boolean;
            /** @description List of initial validators. */
            validators: AccountInfo[];
        } & {
            [key: string]: unknown;
        };
export type GenesisConfigRequest = Record<string, unknown>;
export type GlobalContractDeployMode = "CodeHash" | "AccountId";
export type GlobalContractIdentifier = ({
            CodeHash: CryptoHash;
        } & {
            [key: string]: unknown;
        }) | ({
            AccountId: AccountId;
        } & {
            [key: string]: unknown;
        });
export type HostError = "BadUTF16" | "BadUTF8" | "GasExceeded" | "GasLimitExceeded" | "BalanceExceeded" | "EmptyMethodName" | ({
            GuestPanic: {
                panic_msg: string;
            } & {
                [key: string]: unknown;
            };
        } & {
            [key: string]: unknown;
        }) | "IntegerOverflow" | ({
            InvalidPromiseIndex: {
                /** Format: uint64 */
                promise_idx: number;
            } & {
                [key: string]: unknown;
            };
        } & {
            [key: string]: unknown;
        }) | "CannotAppendActionToJointPromise" | "CannotReturnJointPromise" | ({
            InvalidPromiseResultIndex: {
                /** Format: uint64 */
                result_idx: number;
            } & {
                [key: string]: unknown;
            };
        } & {
            [key: string]: unknown;
        }) | ({
            InvalidRegisterId: {
                /** Format: uint64 */
                register_id: number;
            } & {
                [key: string]: unknown;
            };
        } & {
            [key: string]: unknown;
        }) | ({
            IteratorWasInvalidated: {
                /** Format: uint64 */
                iterator_index: number;
            } & {
                [key: string]: unknown;
            };
        } & {
            [key: string]: unknown;
        }) | "MemoryAccessViolation" | ({
            InvalidReceiptIndex: {
                /** Format: uint64 */
                receipt_index: number;
            } & {
                [key: string]: unknown;
            };
        } & {
            [key: string]: unknown;
        }) | ({
            InvalidIteratorIndex: {
                /** Format: uint64 */
                iterator_index: number;
            } & {
                [key: string]: unknown;
            };
        } & {
            [key: string]: unknown;
        }) | "InvalidAccountId" | "InvalidMethodName" | "InvalidPublicKey" | ({
            ProhibitedInView: {
                method_name: string;
            } & {
                [key: string]: unknown;
            };
        } & {
            [key: string]: unknown;
        }) | ({
            NumberOfLogsExceeded: {
                /** Format: uint64 */
                limit: number;
            } & {
                [key: string]: unknown;
            };
        } & {
            [key: string]: unknown;
        }) | ({
            KeyLengthExceeded: {
                /** Format: uint64 */
                length: number;
                /** Format: uint64 */
                limit: number;
            } & {
                [key: string]: unknown;
            };
        } & {
            [key: string]: unknown;
        }) | ({
            ValueLengthExceeded: {
                /** Format: uint64 */
                length: number;
                /** Format: uint64 */
                limit: number;
            } & {
                [key: string]: unknown;
            };
        } & {
            [key: string]: unknown;
        }) | ({
            TotalLogLengthExceeded: {
                /** Format: uint64 */
                length: number;
                /** Format: uint64 */
                limit: number;
            } & {
                [key: string]: unknown;
            };
        } & {
            [key: string]: unknown;
        }) | ({
            NumberPromisesExceeded: {
                /** Format: uint64 */
                limit: number;
                /** Format: uint64 */
                number_of_promises: number;
            } & {
                [key: string]: unknown;
            };
        } & {
            [key: string]: unknown;
        }) | ({
            NumberInputDataDependenciesExceeded: {
                /** Format: uint64 */
                limit: number;
                /** Format: uint64 */
                number_of_input_data_dependencies: number;
            } & {
                [key: string]: unknown;
            };
        } & {
            [key: string]: unknown;
        }) | ({
            ReturnedValueLengthExceeded: {
                /** Format: uint64 */
                length: number;
                /** Format: uint64 */
                limit: number;
            } & {
                [key: string]: unknown;
            };
        } & {
            [key: string]: unknown;
        }) | ({
            ContractSizeExceeded: {
                /** Format: uint64 */
                limit: number;
                /** Format: uint64 */
                size: number;
            } & {
                [key: string]: unknown;
            };
        } & {
            [key: string]: unknown;
        }) | ({
            Deprecated: {
                method_name: string;
            } & {
                [key: string]: unknown;
            };
        } & {
            [key: string]: unknown;
        }) | ({
            ECRecoverError: {
                msg: string;
            } & {
                [key: string]: unknown;
            };
        } & {
            [key: string]: unknown;
        }) | ({
            AltBn128InvalidInput: {
                msg: string;
            } & {
                [key: string]: unknown;
            };
        } & {
            [key: string]: unknown;
        }) | ({
            Ed25519VerifyInvalidInput: {
                msg: string;
            } & {
                [key: string]: unknown;
            };
        } & {
            [key: string]: unknown;
        });
export type InvalidAccessKeyError = ({
            AccessKeyNotFound: {
                account_id: AccountId;
                public_key: PublicKey;
            } & {
                [key: string]: unknown;
            };
        } & {
            [key: string]: unknown;
        }) | ({
            ReceiverMismatch: {
                ak_receiver: string;
                tx_receiver: AccountId;
            } & {
                [key: string]: unknown;
            };
        } & {
            [key: string]: unknown;
        }) | ({
            MethodNameMismatch: {
                method_name: string;
            } & {
                [key: string]: unknown;
            };
        } & {
            [key: string]: unknown;
        }) | "RequiresFullAccess" | ({
            NotEnoughAllowance: {
                account_id: AccountId;
                allowance: string;
                cost: string;
                public_key: PublicKey;
            } & {
                [key: string]: unknown;
            };
        } & {
            [key: string]: unknown;
        }) | "DepositWithFunctionCall";
export type InvalidTxError = ({
            InvalidAccessKeyError: InvalidAccessKeyError;
        } & {
            [key: string]: unknown;
        }) | ({
            InvalidSignerId: {
                signer_id: string;
            } & {
                [key: string]: unknown;
            };
        } & {
            [key: string]: unknown;
        }) | ({
            SignerDoesNotExist: {
                signer_id: AccountId;
            } & {
                [key: string]: unknown;
            };
        } & {
            [key: string]: unknown;
        }) | ({
            InvalidNonce: {
                /** Format: uint64 */
                ak_nonce: number;
                /** Format: uint64 */
                tx_nonce: number;
            } & {
                [key: string]: unknown;
            };
        } & {
            [key: string]: unknown;
        }) | ({
            NonceTooLarge: {
                /** Format: uint64 */
                tx_nonce: number;
                /** Format: uint64 */
                upper_bound: number;
            } & {
                [key: string]: unknown;
            };
        } & {
            [key: string]: unknown;
        }) | ({
            InvalidReceiverId: {
                receiver_id: string;
            } & {
                [key: string]: unknown;
            };
        } & {
            [key: string]: unknown;
        }) | "InvalidSignature" | ({
            NotEnoughBalance: {
                balance: string;
                cost: string;
                signer_id: AccountId;
            } & {
                [key: string]: unknown;
            };
        } & {
            [key: string]: unknown;
        }) | ({
            LackBalanceForState: {
                /** @description Required balance to cover the state. */
                amount: string;
                /** @description An account which doesn't have enough balance to cover storage. */
                signer_id: AccountId;
            } & {
                [key: string]: unknown;
            };
        } & {
            [key: string]: unknown;
        }) | "CostOverflow" | "InvalidChain" | "Expired" | ({
            ActionsValidation: ActionsValidationError;
        } & {
            [key: string]: unknown;
        }) | ({
            TransactionSizeExceeded: {
                /** Format: uint64 */
                limit: number;
                /** Format: uint64 */
                size: number;
            } & {
                [key: string]: unknown;
            };
        } & {
            [key: string]: unknown;
        }) | "InvalidTransactionVersion" | ({
            StorageError: StorageError;
        } & {
            [key: string]: unknown;
        }) | ({
            ShardCongested: {
                /**
                 * Format: double
                 * @description A value between 0 (no congestion) and 1 (max congestion).
                 */
                congestion_level: number;
                /**
                 * Format: uint32
                 * @description The congested shard.
                 */
                shard_id: number;
            } & {
                [key: string]: unknown;
            };
        } & {
            [key: string]: unknown;
        }) | ({
            ShardStuck: {
                /**
                 * Format: uint64
                 * @description The number of blocks since the last included chunk of the shard.
                 */
                missed_chunks: number;
                /**
                 * Format: uint32
                 * @description The shard that fails making progress.
                 */
                shard_id: number;
            } & {
                [key: string]: unknown;
            };
        } & {
            [key: string]: unknown;
        });
export type JsonRpcRequest_for_block = {
            id: string;
            jsonrpc: string;
            /** @enum {string} */
            method: "block";
            params: RpcBlockRequest;
        } & {
            [key: string]: unknown;
        };
export type JsonRpcRequest_for_broadcast_tx_async = {
            id: string;
            jsonrpc: string;
            /** @enum {string} */
            method: "broadcast_tx_async";
            params: RpcSendTransactionRequest;
        } & {
            [key: string]: unknown;
        };
export type JsonRpcRequest_for_broadcast_tx_commit = {
            id: string;
            jsonrpc: string;
            /** @enum {string} */
            method: "broadcast_tx_commit";
            params: RpcSendTransactionRequest;
        } & {
            [key: string]: unknown;
        };
export type JsonRpcRequest_for_changes = {
            id: string;
            jsonrpc: string;
            /** @enum {string} */
            method: "changes";
            params: RpcStateChangesInBlockByTypeRequest;
        } & {
            [key: string]: unknown;
        };
export type JsonRpcRequest_for_chunk = {
            id: string;
            jsonrpc: string;
            /** @enum {string} */
            method: "chunk";
            params: RpcChunkRequest;
        } & {
            [key: string]: unknown;
        };
export type JsonRpcRequest_for_client_config = {
            id: string;
            jsonrpc: string;
            /** @enum {string} */
            method: "client_config";
            params: RpcClientConfigRequest;
        } & {
            [key: string]: unknown;
        };
export type JsonRpcRequest_for_EXPERIMENTAL_changes = {
            id: string;
            jsonrpc: string;
            /** @enum {string} */
            method: "EXPERIMENTAL_changes";
            params: RpcStateChangesInBlockByTypeRequest;
        } & {
            [key: string]: unknown;
        };
export type JsonRpcRequest_for_EXPERIMENTAL_changes_in_block = {
            id: string;
            jsonrpc: string;
            /** @enum {string} */
            method: "EXPERIMENTAL_changes_in_block";
            params: RpcStateChangesInBlockRequest;
        } & {
            [key: string]: unknown;
        };
export type JsonRpcRequest_for_EXPERIMENTAL_congestion_level = {
            id: string;
            jsonrpc: string;
            /** @enum {string} */
            method: "EXPERIMENTAL_congestion_level";
            params: RpcCongestionLevelRequest;
        } & {
            [key: string]: unknown;
        };
export type JsonRpcRequest_for_EXPERIMENTAL_genesis_config = {
            id: string;
            jsonrpc: string;
            /** @enum {string} */
            method: "EXPERIMENTAL_genesis_config";
            params: GenesisConfigRequest;
        } & {
            [key: string]: unknown;
        };
export type JsonRpcRequest_for_EXPERIMENTAL_light_client_block_proof = {
            id: string;
            jsonrpc: string;
            /** @enum {string} */
            method: "EXPERIMENTAL_light_client_block_proof";
            params: RpcLightClientBlockProofRequest;
        } & {
            [key: string]: unknown;
        };
export type JsonRpcRequest_for_EXPERIMENTAL_light_client_proof = {
            id: string;
            jsonrpc: string;
            /** @enum {string} */
            method: "EXPERIMENTAL_light_client_proof";
            params: RpcLightClientExecutionProofRequest;
        } & {
            [key: string]: unknown;
        };
export type JsonRpcRequest_for_EXPERIMENTAL_maintenance_windows = {
            id: string;
            jsonrpc: string;
            /** @enum {string} */
            method: "EXPERIMENTAL_maintenance_windows";
            params: RpcMaintenanceWindowsRequest;
        } & {
            [key: string]: unknown;
        };
export type JsonRpcRequest_for_EXPERIMENTAL_protocol_config = {
            id: string;
            jsonrpc: string;
            /** @enum {string} */
            method: "EXPERIMENTAL_protocol_config";
            params: RpcProtocolConfigRequest;
        } & {
            [key: string]: unknown;
        };
export type JsonRpcRequest_for_EXPERIMENTAL_receipt = {
            id: string;
            jsonrpc: string;
            /** @enum {string} */
            method: "EXPERIMENTAL_receipt";
            params: RpcReceiptRequest;
        } & {
            [key: string]: unknown;
        };
export type JsonRpcRequest_for_EXPERIMENTAL_split_storage_info = {
            id: string;
            jsonrpc: string;
            /** @enum {string} */
            method: "EXPERIMENTAL_split_storage_info";
            params: RpcSplitStorageInfoRequest;
        } & {
            [key: string]: unknown;
        };
export type JsonRpcRequest_for_EXPERIMENTAL_tx_status = {
            id: string;
            jsonrpc: string;
            /** @enum {string} */
            method: "EXPERIMENTAL_tx_status";
            params: RpcTransactionStatusRequest;
        } & {
            [key: string]: unknown;
        };
export type JsonRpcRequest_for_EXPERIMENTAL_validators_ordered = {
            id: string;
            jsonrpc: string;
            /** @enum {string} */
            method: "EXPERIMENTAL_validators_ordered";
            params: RpcValidatorsOrderedRequest;
        } & {
            [key: string]: unknown;
        };
export type JsonRpcRequest_for_gas_price = {
            id: string;
            jsonrpc: string;
            /** @enum {string} */
            method: "gas_price";
            params: RpcGasPriceRequest;
        } & {
            [key: string]: unknown;
        };
export type JsonRpcRequest_for_health = {
            id: string;
            jsonrpc: string;
            /** @enum {string} */
            method: "health";
            params: RpcHealthRequest;
        } & {
            [key: string]: unknown;
        };
export type JsonRpcRequest_for_light_client_proof = {
            id: string;
            jsonrpc: string;
            /** @enum {string} */
            method: "light_client_proof";
            params: RpcLightClientExecutionProofRequest;
        } & {
            [key: string]: unknown;
        };
export type JsonRpcRequest_for_network_info = {
            id: string;
            jsonrpc: string;
            /** @enum {string} */
            method: "network_info";
            params: RpcNetworkInfoRequest;
        } & {
            [key: string]: unknown;
        };
export type JsonRpcRequest_for_next_light_client_block = {
            id: string;
            jsonrpc: string;
            /** @enum {string} */
            method: "next_light_client_block";
            params: RpcLightClientNextBlockRequest;
        } & {
            [key: string]: unknown;
        };
export type JsonRpcRequest_for_query = {
            id: string;
            jsonrpc: string;
            /** @enum {string} */
            method: "query";
            params: RpcQueryRequest;
        } & {
            [key: string]: unknown;
        };
export type JsonRpcRequest_for_send_tx = {
            id: string;
            jsonrpc: string;
            /** @enum {string} */
            method: "send_tx";
            params: RpcSendTransactionRequest;
        } & {
            [key: string]: unknown;
        };
export type JsonRpcRequest_for_status = {
            id: string;
            jsonrpc: string;
            /** @enum {string} */
            method: "status";
            params: RpcStatusRequest;
        } & {
            [key: string]: unknown;
        };
export type JsonRpcRequest_for_tx = {
            id: string;
            jsonrpc: string;
            /** @enum {string} */
            method: "tx";
            params: RpcTransactionStatusRequest;
        } & {
            [key: string]: unknown;
        };
export type JsonRpcRequest_for_validators = {
            id: string;
            jsonrpc: string;
            /** @enum {string} */
            method: "validators";
            params: RpcValidatorRequest;
        } & {
            [key: string]: unknown;
        };
export type JsonRpcResponse_for_Array_of_Range_of_uint64_and_RpcError = ({
            id: string;
            jsonrpc: string;
        } & {
            [key: string]: unknown;
        }) & (({
            result: Range_of_uint64[];
        } & {
            [key: string]: unknown;
        }) | ({
            error: RpcError;
        } & {
            [key: string]: unknown;
        }));
export type JsonRpcResponse_for_Array_of_ValidatorStakeView_and_RpcError = ({
            id: string;
            jsonrpc: string;
        } & {
            [key: string]: unknown;
        }) & (({
            result: ValidatorStakeView[];
        } & {
            [key: string]: unknown;
        }) | ({
            error: RpcError;
        } & {
            [key: string]: unknown;
        }));
export type JsonRpcResponse_for_CryptoHash_and_RpcError = ({
            id: string;
            jsonrpc: string;
        } & {
            [key: string]: unknown;
        }) & (({
            result: CryptoHash;
        } & {
            [key: string]: unknown;
        }) | ({
            error: RpcError;
        } & {
            [key: string]: unknown;
        }));
export type JsonRpcResponse_for_GenesisConfig_and_RpcError = ({
            id: string;
            jsonrpc: string;
        } & {
            [key: string]: unknown;
        }) & (({
            result: GenesisConfig;
        } & {
            [key: string]: unknown;
        }) | ({
            error: RpcError;
        } & {
            [key: string]: unknown;
        }));
export type JsonRpcResponse_for_Nullable_RpcHealthResponse_and_RpcError = ({
            id: string;
            jsonrpc: string;
        } & {
            [key: string]: unknown;
        }) & (({
            result: RpcHealthResponse | null;
        } & {
            [key: string]: unknown;
        }) | ({
            error: RpcError;
        } & {
            [key: string]: unknown;
        }));
export type JsonRpcResponse_for_RpcBlockResponse_and_RpcError = ({
            id: string;
            jsonrpc: string;
        } & {
            [key: string]: unknown;
        }) & (({
            result: RpcBlockResponse;
        } & {
            [key: string]: unknown;
        }) | ({
            error: RpcError;
        } & {
            [key: string]: unknown;
        }));
export type JsonRpcResponse_for_RpcChunkResponse_and_RpcError = ({
            id: string;
            jsonrpc: string;
        } & {
            [key: string]: unknown;
        }) & (({
            result: RpcChunkResponse;
        } & {
            [key: string]: unknown;
        }) | ({
            error: RpcError;
        } & {
            [key: string]: unknown;
        }));
export type JsonRpcResponse_for_RpcClientConfigResponse_and_RpcError = ({
            id: string;
            jsonrpc: string;
        } & {
            [key: string]: unknown;
        }) & (({
            result: RpcClientConfigResponse;
        } & {
            [key: string]: unknown;
        }) | ({
            error: RpcError;
        } & {
            [key: string]: unknown;
        }));
export type JsonRpcResponse_for_RpcCongestionLevelResponse_and_RpcError = ({
            id: string;
            jsonrpc: string;
        } & {
            [key: string]: unknown;
        }) & (({
            result: RpcCongestionLevelResponse;
        } & {
            [key: string]: unknown;
        }) | ({
            error: RpcError;
        } & {
            [key: string]: unknown;
        }));
export type JsonRpcResponse_for_RpcGasPriceResponse_and_RpcError = ({
            id: string;
            jsonrpc: string;
        } & {
            [key: string]: unknown;
        }) & (({
            result: RpcGasPriceResponse;
        } & {
            [key: string]: unknown;
        }) | ({
            error: RpcError;
        } & {
            [key: string]: unknown;
        }));
export type JsonRpcResponse_for_RpcLightClientBlockProofResponse_and_RpcError = ({
            id: string;
            jsonrpc: string;
        } & {
            [key: string]: unknown;
        }) & (({
            result: RpcLightClientBlockProofResponse;
        } & {
            [key: string]: unknown;
        }) | ({
            error: RpcError;
        } & {
            [key: string]: unknown;
        }));
export type JsonRpcResponse_for_RpcLightClientExecutionProofResponse_and_RpcError = ({
            id: string;
            jsonrpc: string;
        } & {
            [key: string]: unknown;
        }) & (({
            result: RpcLightClientExecutionProofResponse;
        } & {
            [key: string]: unknown;
        }) | ({
            error: RpcError;
        } & {
            [key: string]: unknown;
        }));
export type JsonRpcResponse_for_RpcLightClientNextBlockResponse_and_RpcError = ({
            id: string;
            jsonrpc: string;
        } & {
            [key: string]: unknown;
        }) & (({
            result: RpcLightClientNextBlockResponse;
        } & {
            [key: string]: unknown;
        }) | ({
            error: RpcError;
        } & {
            [key: string]: unknown;
        }));
export type JsonRpcResponse_for_RpcNetworkInfoResponse_and_RpcError = ({
            id: string;
            jsonrpc: string;
        } & {
            [key: string]: unknown;
        }) & (({
            result: RpcNetworkInfoResponse;
        } & {
            [key: string]: unknown;
        }) | ({
            error: RpcError;
        } & {
            [key: string]: unknown;
        }));
export type JsonRpcResponse_for_RpcProtocolConfigResponse_and_RpcError = ({
            id: string;
            jsonrpc: string;
        } & {
            [key: string]: unknown;
        }) & (({
            result: RpcProtocolConfigResponse;
        } & {
            [key: string]: unknown;
        }) | ({
            error: RpcError;
        } & {
            [key: string]: unknown;
        }));
export type JsonRpcResponse_for_RpcQueryResponse_and_RpcError = ({
            id: string;
            jsonrpc: string;
        } & {
            [key: string]: unknown;
        }) & (({
            result: RpcQueryResponse;
        } & {
            [key: string]: unknown;
        }) | ({
            error: RpcError;
        } & {
            [key: string]: unknown;
        }));
export type JsonRpcResponse_for_RpcReceiptResponse_and_RpcError = ({
            id: string;
            jsonrpc: string;
        } & {
            [key: string]: unknown;
        }) & (({
            result: RpcReceiptResponse;
        } & {
            [key: string]: unknown;
        }) | ({
            error: RpcError;
        } & {
            [key: string]: unknown;
        }));
export type JsonRpcResponse_for_RpcSplitStorageInfoResponse_and_RpcError = ({
            id: string;
            jsonrpc: string;
        } & {
            [key: string]: unknown;
        }) & (({
            result: RpcSplitStorageInfoResponse;
        } & {
            [key: string]: unknown;
        }) | ({
            error: RpcError;
        } & {
            [key: string]: unknown;
        }));
export type JsonRpcResponse_for_RpcStateChangesInBlockByTypeResponse_and_RpcError = ({
            id: string;
            jsonrpc: string;
        } & {
            [key: string]: unknown;
        }) & (({
            result: RpcStateChangesInBlockByTypeResponse;
        } & {
            [key: string]: unknown;
        }) | ({
            error: RpcError;
        } & {
            [key: string]: unknown;
        }));
export type JsonRpcResponse_for_RpcStateChangesInBlockResponse_and_RpcError = ({
            id: string;
            jsonrpc: string;
        } & {
            [key: string]: unknown;
        }) & (({
            result: RpcStateChangesInBlockResponse;
        } & {
            [key: string]: unknown;
        }) | ({
            error: RpcError;
        } & {
            [key: string]: unknown;
        }));
export type JsonRpcResponse_for_RpcStatusResponse_and_RpcError = ({
            id: string;
            jsonrpc: string;
        } & {
            [key: string]: unknown;
        }) & (({
            result: RpcStatusResponse;
        } & {
            [key: string]: unknown;
        }) | ({
            error: RpcError;
        } & {
            [key: string]: unknown;
        }));
export type JsonRpcResponse_for_RpcTransactionResponse_and_RpcError = ({
            id: string;
            jsonrpc: string;
        } & {
            [key: string]: unknown;
        }) & (({
            result: RpcTransactionResponse;
        } & {
            [key: string]: unknown;
        }) | ({
            error: RpcError;
        } & {
            [key: string]: unknown;
        }));
export type JsonRpcResponse_for_RpcValidatorResponse_and_RpcError = ({
            id: string;
            jsonrpc: string;
        } & {
            [key: string]: unknown;
        }) & (({
            result: RpcValidatorResponse;
        } & {
            [key: string]: unknown;
        }) | ({
            error: RpcError;
        } & {
            [key: string]: unknown;
        }));
export type KnownProducerView = {
            account_id: AccountId;
            next_hops?: PublicKey[] | null;
            peer_id: PublicKey;
        } & {
            [key: string]: unknown;
        };
export type LightClientBlockLiteView = {
            inner_lite: BlockHeaderInnerLiteView;
            inner_rest_hash: CryptoHash;
            prev_block_hash: CryptoHash;
        } & {
            [key: string]: unknown;
        };
export type LimitConfig = {
            /**
             * @description Whether to enforce account_id well-formed-ness where it wasn't enforced
             *      historically.
             * @default 0
             */
            account_id_validity_rules_version: AccountIdValidityRulesVersion;
            /**
             * Format: uint32
             * @description The initial number of memory pages.
             *      NOTE: It's not a limiter itself, but it's a value we use for initial_memory_pages.
             */
            initial_memory_pages: number;
            /**
             * Format: uint64
             * @description Max number of actions per receipt.
             */
            max_actions_per_receipt: number;
            /**
             * Format: uint64
             * @description Max length of arguments in a function call action.
             */
            max_arguments_length: number;
            /**
             * Format: uint64
             * @description Max contract size
             */
            max_contract_size: number;
            /**
             * Format: uint64
             * @description If present, stores max number of functions in one contract
             */
            max_functions_number_per_contract?: number | null;
            /**
             * Format: uint64
             * @description Max amount of gas that can be used, excluding gas attached to promises.
             */
            max_gas_burnt: number;
            /**
             * Format: uint64
             * @description Max length of any method name (without terminating character).
             */
            max_length_method_name: number;
            /**
             * Format: uint64
             * @description Max length of returned data
             */
            max_length_returned_data: number;
            /**
             * Format: uint64
             * @description Max storage key size
             */
            max_length_storage_key: number;
            /**
             * Format: uint64
             * @description Max storage value size
             */
            max_length_storage_value: number;
            /**
             * Format: uint64
             * @description If present, stores max number of locals declared globally in one contract
             */
            max_locals_per_contract?: number | null;
            /**
             * Format: uint32
             * @description What is the maximal memory pages amount is allowed to have for a contract.
             */
            max_memory_pages: number;
            /**
             * Format: uint64
             * @description Max total length of all method names (including terminating character) for a function call
             *      permission access key.
             */
            max_number_bytes_method_names: number;
            /**
             * Format: uint64
             * @description Max number of input data dependencies
             */
            max_number_input_data_dependencies: number;
            /**
             * Format: uint64
             * @description Maximum number of log entries.
             */
            max_number_logs: number;
            /**
             * Format: uint64
             * @description Maximum number of registers that can be used simultaneously.
             *
             *      Note that due to an implementation quirk [read: a bug] in VMLogic, if we
             *      have this number of registers, no subsequent writes to the registers
             *      will succeed even if they replace an existing register.
             */
            max_number_registers: number;
            /**
             * Format: uint64
             * @description Max number of promises that a function call can create
             */
            max_promises_per_function_call_action: number;
            /**
             * Format: uint64
             * @description Max receipt size
             */
            max_receipt_size: number;
            /**
             * Format: uint64
             * @description Maximum number of bytes that can be stored in a single register.
             */
            max_register_size: number;
            /**
             * Format: uint32
             * @description How tall the stack is allowed to grow?
             *
             *      See <https://wiki.parity.io/WebAssembly-StackHeight> to find out how the stack frame cost
             *      is calculated.
             */
            max_stack_height: number;
            /**
             * Format: uint64
             * @description Maximum total length in bytes of all log messages.
             */
            max_total_log_length: number;
            /**
             * Format: uint64
             * @description Max total prepaid gas for all function call actions per receipt.
             */
            max_total_prepaid_gas: number;
            /**
             * Format: uint64
             * @description Max transaction size
             */
            max_transaction_size: number;
            /**
             * Format: uint64
             * @description Maximum number of bytes for payload passed over a yield resume.
             */
            max_yield_payload_size: number;
            /**
             * Format: uint
             * @description Hard limit on the size of storage proof generated while executing a single receipt.
             */
            per_receipt_storage_proof_size_limit: number;
            /**
             * Format: uint64
             * @description Limit of memory used by registers.
             */
            registers_memory_limit: number;
            /**
             * Format: uint64
             * @description Number of blocks after which a yielded promise times out.
             */
            yield_timeout_length_in_blocks: number;
        } & {
            [key: string]: unknown;
        };
export type LogSummaryStyle = "plain" | "colored";
export type MerklePathItem = {
            direction: Direction;
            hash: CryptoHash;
        } & {
            [key: string]: unknown;
        };
export type MethodResolveError = "MethodEmptyName" | "MethodNotFound" | "MethodInvalidSignature";
export type MissingTrieValue = {
            context: MissingTrieValueContext;
            hash: CryptoHash;
        } & {
            [key: string]: unknown;
        };
export type MissingTrieValueContext = "TrieIterator" | "TriePrefetchingStorage" | "TrieMemoryPartialStorage" | "TrieStorage";
export type MutableConfigValue = string;
export type NetworkInfoView = {
            connected_peers: PeerInfoView[];
            known_producers: KnownProducerView[];
            /** Format: uint */
            num_connected_peers: number;
            /** Format: uint32 */
            peer_max_count: number;
            tier1_accounts_data: AccountDataView[];
            tier1_accounts_keys: PublicKey[];
            tier1_connections: PeerInfoView[];
        } & {
            [key: string]: unknown;
        };
export type NextEpochValidatorInfo = {
            account_id: AccountId;
            public_key: PublicKey;
            shards: ShardId[];
            stake: string;
        } & {
            [key: string]: unknown;
        };
export type NonDelegateAction = Action;
export type PeerId = PublicKey;
export type PeerInfoView = {
            account_id?: AccountId | null;
            addr: string;
            archival: boolean;
            block_hash?: CryptoHash | null;
            /** Format: uint64 */
            connection_established_time_millis: number;
            /** Format: uint64 */
            height?: number | null;
            is_highest_block_invalid: boolean;
            is_outbound_peer: boolean;
            /** Format: uint64 */
            last_time_peer_requested_millis: number;
            /** Format: uint64 */
            last_time_received_message_millis: number;
            /**
             * Format: uint64
             * @description Connection nonce.
             */
            nonce: number;
            peer_id: PublicKey;
            /** Format: uint64 */
            received_bytes_per_sec: number;
            /** Format: uint64 */
            sent_bytes_per_sec: number;
            tracked_shards: ShardId[];
        } & {
            [key: string]: unknown;
        };
export type PrepareError = "Serialization" | "Deserialization" | "InternalMemoryDeclared" | "GasInstrumentation" | "StackHeightInstrumentation" | "Instantiate" | "Memory" | "TooManyFunctions" | "TooManyLocals";
export type PublicKey = string;
export type Range_of_uint64 = {
            /** Format: uint64 */
            end: number;
            /** Format: uint64 */
            start: number;
        } & {
            [key: string]: unknown;
        };
export type ReceiptEnumView = ({
            Action: {
                actions: ActionView[];
                gas_price: string;
                input_data_ids: CryptoHash[];
                /** @default false */
                is_promise_yield: boolean;
                output_data_receivers: DataReceiverView[];
                signer_id: AccountId;
                signer_public_key: PublicKey;
            } & {
                [key: string]: unknown;
            };
        } & {
            [key: string]: unknown;
        }) | ({
            Data: {
                /** @default null */
                data: string | null;
                data_id: CryptoHash;
                /** @default false */
                is_promise_resume: boolean;
            } & {
                [key: string]: unknown;
            };
        } & {
            [key: string]: unknown;
        }) | ({
            GlobalContractDistribution: {
                already_delivered_shards: ShardId[];
                code: string;
                id: GlobalContractIdentifier;
                target_shard: ShardId;
            } & {
                [key: string]: unknown;
            };
        } & {
            [key: string]: unknown;
        });
export type ReceiptValidationError = ({
            InvalidPredecessorId: {
                account_id: string;
            } & {
                [key: string]: unknown;
            };
        } & {
            [key: string]: unknown;
        }) | ({
            InvalidReceiverId: {
                account_id: string;
            } & {
                [key: string]: unknown;
            };
        } & {
            [key: string]: unknown;
        }) | ({
            InvalidSignerId: {
                account_id: string;
            } & {
                [key: string]: unknown;
            };
        } & {
            [key: string]: unknown;
        }) | ({
            InvalidDataReceiverId: {
                account_id: string;
            } & {
                [key: string]: unknown;
            };
        } & {
            [key: string]: unknown;
        }) | ({
            ReturnedValueLengthExceeded: {
                /** Format: uint64 */
                length: number;
                /** Format: uint64 */
                limit: number;
            } & {
                [key: string]: unknown;
            };
        } & {
            [key: string]: unknown;
        }) | ({
            NumberInputDataDependenciesExceeded: {
                /** Format: uint64 */
                limit: number;
                /** Format: uint64 */
                number_of_input_data_dependencies: number;
            } & {
                [key: string]: unknown;
            };
        } & {
            [key: string]: unknown;
        }) | ({
            ActionsValidation: ActionsValidationError;
        } & {
            [key: string]: unknown;
        }) | ({
            ReceiptSizeExceeded: {
                /** Format: uint64 */
                limit: number;
                /** Format: uint64 */
                size: number;
            } & {
                [key: string]: unknown;
            };
        } & {
            [key: string]: unknown;
        });
export type ReceiptView = {
            predecessor_id: AccountId;
            /**
             * Format: uint64
             * @default 0
             */
            priority: number;
            receipt: ReceiptEnumView;
            receipt_id: CryptoHash;
            receiver_id: AccountId;
        } & {
            [key: string]: unknown;
        };
export type RpcBlockRequest = ({
            block_id: BlockId;
        } & {
            [key: string]: unknown;
        }) | ({
            finality: Finality;
        } & {
            [key: string]: unknown;
        }) | ({
            sync_checkpoint: SyncCheckpoint;
        } & {
            [key: string]: unknown;
        });
export type RpcBlockResponse = {
            author: AccountId;
            chunks: ChunkHeaderView[];
            header: BlockHeaderView;
        } & {
            [key: string]: unknown;
        };
export type RpcChunkRequest = ({
            block_id: BlockId;
            shard_id: ShardId;
        } & {
            [key: string]: unknown;
        }) | ({
            chunk_id: CryptoHash;
        } & {
            [key: string]: unknown;
        });
export type RpcChunkResponse = {
            author: AccountId;
            header: ChunkHeaderView;
            receipts: ReceiptView[];
            transactions: SignedTransactionView[];
        } & {
            [key: string]: unknown;
        };
export type RpcClientConfigRequest = Record<string, unknown>;
export type RpcClientConfigResponse = {
            /** @description Not clear old data, set `true` for archive nodes. */
            archive: boolean;
            /**
             * Format: uint64
             * @description Horizon at which instead of fetching block, fetch full state.
             */
            block_fetch_horizon: number;
            /**
             * Format: uint64
             * @description Behind this horizon header fetch kicks in.
             */
            block_header_fetch_horizon: number;
            /** @description Duration to check for producing / skipping block. */
            block_production_tracking_delay: number[];
            /** @description Time between check to perform catchup. */
            catchup_step_period: number[];
            /** @description Chain id for status. */
            chain_id: string;
            /** @description Optional config for the Chunk Distribution Network feature.
             *      If set to `None` then this node does not participate in the Chunk Distribution Network.
             *      Nodes not participating will still function fine, but possibly with higher
             *      latency due to the need of requesting chunks over the peer-to-peer network. */
            chunk_distribution_network?: ChunkDistributionNetworkConfig | null;
            /** @description Time between checking to re-request chunks. */
            chunk_request_retry_period: number[];
            /** @description Multiplier for the wait time for all chunks to be received. */
            chunk_wait_mult: number[];
            /**
             * Format: uint
             * @description Number of threads to execute background migration work in client.
             */
            client_background_migration_threads: number;
            /** @description Time between running doomslug timer. */
            doomslug_step_period: number[];
            enable_multiline_logging: boolean;
            /** @description Re-export storage layer statistics as prometheus metrics. */
            enable_statistics_export: boolean;
            /**
             * Format: uint64
             * @description Epoch length.
             */
            epoch_length: number;
            /** @description Options for epoch sync. */
            epoch_sync: EpochSyncConfig;
            /** @description Graceful shutdown at expected block height. */
            expected_shutdown: MutableConfigValue;
            /** @description Garbage collection configuration. */
            gc: GCConfig;
            /**
             * Format: uint64
             * @description Expected increase of header head height per second during header sync
             */
            header_sync_expected_height_per_second: number;
            /** @description How much time to wait after initial header sync */
            header_sync_initial_timeout: number[];
            /** @description How much time to wait after some progress is made in header sync */
            header_sync_progress_timeout: number[];
            /** @description How much time to wait before banning a peer in header sync if sync is too slow */
            header_sync_stall_ban_timeout: number[];
            /** @description Period between logging summary information. */
            log_summary_period: number[];
            /** @description Enable coloring of the logs */
            log_summary_style: LogSummaryStyle;
            /** @description Maximum wait for approvals before producing block. */
            max_block_production_delay: number[];
            /** @description Maximum duration before skipping given height. */
            max_block_wait_delay: number[];
            /**
             * Format: uint64
             * @description Max burnt gas per view method.  If present, overrides value stored in
             *      genesis file.  The value only affects the RPCs without influencing the
             *      protocol thus changing it per-node doesn’t affect the blockchain.
             */
            max_gas_burnt_view?: number | null;
            /** @description Minimum duration before producing block. */
            min_block_production_delay: number[];
            /**
             * Format: uint
             * @description Minimum number of peers to start syncing.
             */
            min_num_peers: number;
            /**
             * Format: uint64
             * @description Number of block producer seats
             */
            num_block_producer_seats: number;
            /**
             * Format: uint64
             * @description Maximum size of state witnesses in the OrphanStateWitnessPool.
             *
             *      We keep only orphan witnesses which are smaller than this size.
             *      This limits the maximum memory usage of OrphanStateWitnessPool.
             */
            orphan_state_witness_max_size: number;
            /**
             * Format: uint
             * @description OrphanStateWitnessPool keeps instances of ChunkStateWitness which can't be processed
             *      because the previous block isn't available. The witnesses wait in the pool until the
             *      required block appears. This variable controls how many witnesses can be stored in the pool.
             */
            orphan_state_witness_pool_size: number;
            /** @description Limit the time of adding transactions to a chunk.
             *      A node produces a chunk by adding transactions from the transaction pool until
             *      some limit is reached. This time limit ensures that adding transactions won't take
             *      longer than the specified duration, which helps to produce the chunk quickly. */
            produce_chunk_add_transactions_time_limit: string;
            /** @description Produce empty blocks, use `false` for testing. */
            produce_empty_blocks: boolean;
            resharding_config: MutableConfigValue;
            /** @description Listening rpc port for status. */
            rpc_addr?: string | null;
            /** @description Save observed instances of invalid ChunkStateWitness to the database in DBCol::InvalidChunkStateWitnesses.
             *      Saving invalid witnesses is useful for analysis and debugging.
             *      This option can cause extra load on the database and is not recommended for production use. */
            save_invalid_witnesses: boolean;
            /** @description Save observed instances of ChunkStateWitness to the database in DBCol::LatestChunkStateWitnesses.
             *      Saving the latest witnesses is useful for analysis and debugging.
             *      This option can cause extra load on the database and is not recommended for production use. */
            save_latest_witnesses: boolean;
            /** @description save_trie_changes should be set to true iff
             *      - archive if false - non-archival nodes need trie changes to perform garbage collection
             *      - archive is true, cold_store is configured and migration to split_storage is finished - node
             *      working in split storage mode needs trie changes in order to do garbage collection on hot. */
            save_trie_changes: boolean;
            /** @description Whether to persist transaction outcomes to disk or not. */
            save_tx_outcomes: boolean;
            /** @description Skip waiting for sync (for testing or single node testnet). */
            skip_sync_wait: boolean;
            /** @description Options for syncing state. */
            state_sync: StateSyncConfig;
            /** @description Whether to use the State Sync mechanism.
             *      If disabled, the node will do Block Sync instead of State Sync. */
            state_sync_enabled: boolean;
            /** @description Additional waiting period after a failed request to external storage */
            state_sync_external_backoff: number[];
            /** @description How long to wait for a response from centralized state sync */
            state_sync_external_timeout: number[];
            /** @description How long to wait for a response from p2p state sync */
            state_sync_p2p_timeout: number[];
            /** @description How long to wait after a failed state sync request */
            state_sync_retry_backoff: number[];
            /** @description How often to check that we are not out of sync. */
            sync_check_period: number[];
            /**
             * Format: uint64
             * @description Sync height threshold: below this difference in height don't start syncing.
             */
            sync_height_threshold: number;
            /**
             * Format: uint
             * @description Maximum number of block requests to send to peers to sync
             */
            sync_max_block_requests: number;
            /** @description While syncing, how long to check for each step. */
            sync_step_period: number[];
            tracked_shards_config: TrackedShardsConfig;
            /**
             * Format: uint64
             * @description Limit of the size of per-shard transaction pool measured in bytes. If not set, the size
             *      will be unbounded.
             */
            transaction_pool_size_limit?: number | null;
            /** Format: uint */
            transaction_request_handler_threads: number;
            /**
             * Format: uint64
             * @description Upper bound of the byte size of contract state that is still viewable. None is no limit
             */
            trie_viewer_state_size_limit?: number | null;
            /** @description Time to persist Accounts Id in the router without removing them. */
            ttl_account_id_router: number[];
            /**
             * Format: uint64
             * @description If the node is not a chunk producer within that many blocks, then route
             *      to upcoming chunk producers.
             */
            tx_routing_height_horizon: number;
            /** @description Version of the binary. */
            version: Version;
            /**
             * Format: uint
             * @description Number of threads for ViewClientActor pool.
             */
            view_client_threads: number;
            /** @description Number of seconds between state requests for view client. */
            view_client_throttle_period: number[];
        } & {
            [key: string]: unknown;
        };
export type RpcCongestionLevelRequest = ({
            block_id: BlockId;
            shard_id: ShardId;
        } & {
            [key: string]: unknown;
        }) | ({
            chunk_id: CryptoHash;
        } & {
            [key: string]: unknown;
        });
export type RpcCongestionLevelResponse = {
            /** Format: double */
            congestion_level: number;
        } & {
            [key: string]: unknown;
        };
export type RpcError = ({
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
        } & {
            [key: string]: unknown;
        }) & (({
            cause: RpcRequestValidationErrorKind;
            /** @enum {string} */
            name: "REQUEST_VALIDATION_ERROR";
        } & {
            [key: string]: unknown;
        }) | ({
            cause: unknown;
            /** @enum {string} */
            name: "HANDLER_ERROR";
        } & {
            [key: string]: unknown;
        }) | ({
            cause: unknown;
            /** @enum {string} */
            name: "INTERNAL_ERROR";
        } & {
            [key: string]: unknown;
        }));
export type RpcGasPriceRequest = {
            block_id?: BlockId | null;
        } & {
            [key: string]: unknown;
        };
export type RpcGasPriceResponse = {
            gas_price: string;
        } & {
            [key: string]: unknown;
        };
export type RpcHealthRequest = Record<string, unknown>;
export type RpcHealthResponse = Record<string, unknown>;
export type RpcKnownProducer = {
            account_id: AccountId;
            addr?: string | null;
            peer_id: PeerId;
        } & {
            [key: string]: unknown;
        };
export type RpcLightClientBlockProofRequest = {
            block_hash: CryptoHash;
            light_client_head: CryptoHash;
        } & {
            [key: string]: unknown;
        };
export type RpcLightClientBlockProofResponse = {
            block_header_lite: LightClientBlockLiteView;
            block_proof: MerklePathItem[];
        } & {
            [key: string]: unknown;
        };
export type RpcLightClientExecutionProofRequest = ({
            light_client_head: CryptoHash;
        } & {
            [key: string]: unknown;
        }) & (({
            sender_id: AccountId;
            transaction_hash: CryptoHash;
            /** @enum {string} */
            type: "transaction";
        } & {
            [key: string]: unknown;
        }) | ({
            receipt_id: CryptoHash;
            receiver_id: AccountId;
            /** @enum {string} */
            type: "receipt";
        } & {
            [key: string]: unknown;
        }));
export type RpcLightClientExecutionProofResponse = {
            block_header_lite: LightClientBlockLiteView;
            block_proof: MerklePathItem[];
            outcome_proof: ExecutionOutcomeWithIdView;
            outcome_root_proof: MerklePathItem[];
        } & {
            [key: string]: unknown;
        };
export type RpcLightClientNextBlockRequest = {
            last_block_hash: CryptoHash;
        } & {
            [key: string]: unknown;
        };
export type RpcLightClientNextBlockResponse = {
            approvals_after_next?: (Signature | null)[];
            inner_lite?: BlockHeaderInnerLiteView;
            inner_rest_hash?: CryptoHash;
            next_block_inner_hash?: CryptoHash;
            next_bps?: ValidatorStakeView[] | null;
            prev_block_hash?: CryptoHash;
        } & {
            [key: string]: unknown;
        };
export type RpcMaintenanceWindowsRequest = {
            account_id: AccountId;
        } & {
            [key: string]: unknown;
        };
export type RpcNetworkInfoRequest = Record<string, unknown>;
export type RpcNetworkInfoResponse = {
            active_peers: RpcPeerInfo[];
            /** @description Accounts of known block and chunk producers from routing table. */
            known_producers: RpcKnownProducer[];
            /** Format: uint */
            num_active_peers: number;
            /** Format: uint32 */
            peer_max_count: number;
            /** Format: uint64 */
            received_bytes_per_sec: number;
            /** Format: uint64 */
            sent_bytes_per_sec: number;
        } & {
            [key: string]: unknown;
        };
export type RpcPeerInfo = {
            account_id?: AccountId | null;
            addr?: string | null;
            id: PeerId;
        } & {
            [key: string]: unknown;
        };
export type RpcProtocolConfigRequest = ({
            block_id: BlockId;
        } & {
            [key: string]: unknown;
        }) | ({
            finality: Finality;
        } & {
            [key: string]: unknown;
        }) | ({
            sync_checkpoint: SyncCheckpoint;
        } & {
            [key: string]: unknown;
        });
export type RpcProtocolConfigResponse = {
            /** @description Expected number of hidden validators per shard. */
            avg_hidden_validator_seats_per_shard: number[];
            /**
             * Format: uint8
             * @description Threshold for kicking out block producers, between 0 and 100.
             */
            block_producer_kickout_threshold: number;
            /** @description ID of the blockchain. This must be unique for every blockchain.
             *      If your testnet blockchains do not have unique chain IDs, you will have a bad time. */
            chain_id: string;
            /**
             * Format: uint8
             * @description Threshold for kicking out chunk producers, between 0 and 100.
             */
            chunk_producer_kickout_threshold: number;
            /**
             * Format: uint8
             * @description Threshold for kicking out nodes which are only chunk validators, between 0 and 100.
             */
            chunk_validator_only_kickout_threshold: number;
            /** @description Enable dynamic re-sharding. */
            dynamic_resharding: boolean;
            /**
             * Format: uint64
             * @description Epoch length counted in block heights.
             */
            epoch_length: number;
            /** @description Fishermen stake threshold. */
            fishermen_threshold: string;
            /**
             * Format: uint64
             * @description Initial gas limit.
             */
            gas_limit: number;
            /** @description Gas price adjustment rate */
            gas_price_adjustment_rate: number[];
            /**
             * Format: uint64
             * @description Height of genesis block.
             */
            genesis_height: number;
            /**
             * Format: date-time
             * @description Official time of blockchain start.
             */
            genesis_time: string;
            /** @description Maximum gas price. */
            max_gas_price: string;
            /** @description Maximum inflation on the total supply every epoch. */
            max_inflation_rate: number[];
            /**
             * Format: uint8
             * @description Max stake percentage of the validators we will kick out.
             */
            max_kickout_stake_perc: number;
            /** @description Minimum gas price. It is also the initial gas price. */
            min_gas_price: string;
            /**
             * Format: uint64
             * @description The minimum stake required for staking is last seat price divided by this number.
             */
            minimum_stake_divisor: number;
            /** @description The lowest ratio s/s_total any block producer can have.
             *      See <https://github.com/near/NEPs/pull/167> for details */
            minimum_stake_ratio: number[];
            /**
             * Format: uint64
             * @description The minimum number of validators each shard must have
             */
            minimum_validators_per_shard: number;
            /**
             * Format: uint64
             * @description Number of block producer seats at genesis.
             */
            num_block_producer_seats: number;
            /** @description Defines number of shards and number of block producer seats per each shard at genesis. */
            num_block_producer_seats_per_shard: number[];
            /**
             * Format: uint64
             * @description Expected number of blocks per year
             */
            num_blocks_per_year: number;
            /** @description Online maximum threshold above which validator gets full reward. */
            online_max_threshold: number[];
            /** @description Online minimum threshold below which validator doesn't receive reward. */
            online_min_threshold: number[];
            /** @description Protocol treasury rate */
            protocol_reward_rate: number[];
            /** @description Protocol treasury account */
            protocol_treasury_account: AccountId;
            /** @description Threshold of stake that needs to indicate that they ready for upgrade. */
            protocol_upgrade_stake_threshold: number[];
            /**
             * Format: uint32
             * @description Current Protocol Version
             */
            protocol_version: number;
            /** @description Runtime configuration (mostly economics constants). */
            runtime_config: RuntimeConfigView;
            /** @description Layout information regarding how to split accounts to shards */
            shard_layout: ShardLayout;
            /** @description If true, shuffle the chunk producers across shards. In other words, if
             *      the shard assignments were `[S_0, S_1, S_2, S_3]` where `S_i` represents
             *      the set of chunk producers for shard `i`, if this flag were true, the
             *      shard assignments might become, for example, `[S_2, S_0, S_3, S_1]`. */
            shuffle_shard_assignment_for_chunk_producers: boolean;
            /**
             * Format: uint64
             * @description Number of target chunk validator mandates for each shard.
             */
            target_validator_mandates_per_shard: number;
            /**
             * Format: uint64
             * @description Number of blocks for which a given transaction is valid
             */
            transaction_validity_period: number;
        } & {
            [key: string]: unknown;
        };
export type RpcQueryRequest = (({
            block_id: BlockId;
        } & {
            [key: string]: unknown;
        }) | ({
            finality: Finality;
        } & {
            [key: string]: unknown;
        }) | ({
            sync_checkpoint: SyncCheckpoint;
        } & {
            [key: string]: unknown;
        })) & (({
            account_id: AccountId;
            /** @enum {string} */
            request_type: "view_account";
        } & {
            [key: string]: unknown;
        }) | ({
            account_id: AccountId;
            /** @enum {string} */
            request_type: "view_code";
        } & {
            [key: string]: unknown;
        }) | ({
            account_id: AccountId;
            include_proof?: boolean;
            /** Format: bytes */
            prefix_base64: string;
            /** @enum {string} */
            request_type: "view_state";
        } & {
            [key: string]: unknown;
        }) | ({
            account_id: AccountId;
            public_key: PublicKey;
            /** @enum {string} */
            request_type: "view_access_key";
        } & {
            [key: string]: unknown;
        }) | ({
            account_id: AccountId;
            /** @enum {string} */
            request_type: "view_access_key_list";
        } & {
            [key: string]: unknown;
        }) | ({
            account_id: AccountId;
            /** Format: bytes */
            args_base64: string;
            method_name: string;
            /** @enum {string} */
            request_type: "call_function";
        } & {
            [key: string]: unknown;
        }) | ({
            code_hash: CryptoHash;
            /** @enum {string} */
            request_type: "view_global_contract_code";
        } & {
            [key: string]: unknown;
        }) | ({
            account_id: AccountId;
            /** @enum {string} */
            request_type: "view_global_contract_code_by_account_id";
        } & {
            [key: string]: unknown;
        }));
export type RpcQueryResponse = ({
            block_hash: CryptoHash;
            /** Format: uint64 */
            block_height: number;
        } & {
            [key: string]: unknown;
        }) | AccountView | ContractCodeView | ViewStateResult | CallResult | AccessKeyView | AccessKeyList;
export type RpcReceiptRequest = {
            receipt_id: CryptoHash;
        } & {
            [key: string]: unknown;
        };
export type RpcReceiptResponse = {
            predecessor_id: AccountId;
            /**
             * Format: uint64
             * @default 0
             */
            priority: number;
            receipt: ReceiptEnumView;
            receipt_id: CryptoHash;
            receiver_id: AccountId;
        } & {
            [key: string]: unknown;
        };
export type RpcRequestValidationErrorKind = ({
            info: {
                method_name: string;
            } & {
                [key: string]: unknown;
            };
            /** @enum {string} */
            name: "METHOD_NOT_FOUND";
        } & {
            [key: string]: unknown;
        }) | ({
            info: {
                error_message: string;
            } & {
                [key: string]: unknown;
            };
            /** @enum {string} */
            name: "PARSE_ERROR";
        } & {
            [key: string]: unknown;
        });
export type RpcSendTransactionRequest = {
            signed_tx_base64: SignedTransaction;
            /** @default EXECUTED_OPTIMISTIC */
            wait_until: TxExecutionStatus;
        } & {
            [key: string]: unknown;
        };
export type RpcSplitStorageInfoRequest = Record<string, unknown>;
export type RpcSplitStorageInfoResponse = {
            /** Format: uint64 */
            cold_head_height?: number | null;
            /** Format: uint64 */
            final_head_height?: number | null;
            /** Format: uint64 */
            head_height?: number | null;
            hot_db_kind?: string | null;
        } & {
            [key: string]: unknown;
        };
export type RpcStateChangesInBlockByTypeRequest = (({
            block_id: BlockId;
        } & {
            [key: string]: unknown;
        }) | ({
            finality: Finality;
        } & {
            [key: string]: unknown;
        }) | ({
            sync_checkpoint: SyncCheckpoint;
        } & {
            [key: string]: unknown;
        })) & (({
            account_ids: AccountId[];
            /** @enum {string} */
            changes_type: "account_changes";
        } & {
            [key: string]: unknown;
        }) | ({
            /** @enum {string} */
            changes_type: "single_access_key_changes";
            keys: AccountWithPublicKey[];
        } & {
            [key: string]: unknown;
        }) | ({
            /** @enum {string} */
            changes_type: "single_gas_key_changes";
            keys: AccountWithPublicKey[];
        } & {
            [key: string]: unknown;
        }) | ({
            account_ids: AccountId[];
            /** @enum {string} */
            changes_type: "all_access_key_changes";
        } & {
            [key: string]: unknown;
        }) | ({
            account_ids: AccountId[];
            /** @enum {string} */
            changes_type: "all_gas_key_changes";
        } & {
            [key: string]: unknown;
        }) | ({
            account_ids: AccountId[];
            /** @enum {string} */
            changes_type: "contract_code_changes";
        } & {
            [key: string]: unknown;
        }) | ({
            account_ids: AccountId[];
            /** @enum {string} */
            changes_type: "data_changes";
            /** Format: bytes */
            key_prefix_base64: string;
        } & {
            [key: string]: unknown;
        }));
export type RpcStateChangesInBlockByTypeResponse = {
            block_hash: CryptoHash;
            changes: StateChangeKindView[];
        } & {
            [key: string]: unknown;
        };
export type RpcStateChangesInBlockRequest = ({
            block_id: BlockId;
        } & {
            [key: string]: unknown;
        }) | ({
            finality: Finality;
        } & {
            [key: string]: unknown;
        }) | ({
            sync_checkpoint: SyncCheckpoint;
        } & {
            [key: string]: unknown;
        });
export type RpcStateChangesInBlockResponse = {
            block_hash: CryptoHash;
            changes: StateChangeWithCauseView[];
        } & {
            [key: string]: unknown;
        };
export type RpcStatusRequest = Record<string, unknown>;
export type RpcStatusResponse = {
            /** @description Unique chain id. */
            chain_id: string;
            /** @description Information about last blocks, network, epoch and chain & chunk info. */
            detailed_debug_status?: DetailedDebugStatus | null;
            /** @description Genesis hash of the chain. */
            genesis_hash: CryptoHash;
            /**
             * Format: uint32
             * @description Latest protocol version that this client supports.
             */
            latest_protocol_version: number;
            /** @description Deprecated; same as `validator_public_key` which you should use instead. */
            node_key?: PublicKey | null;
            /** @description Public key of the node. */
            node_public_key: PublicKey;
            /**
             * Format: uint32
             * @description Currently active protocol version.
             */
            protocol_version: number;
            /** @description Address for RPC server.  None if node doesn't have RPC endpoint enabled. */
            rpc_addr?: string | null;
            /** @description Sync status of the node. */
            sync_info: StatusSyncInfo;
            /**
             * Format: int64
             * @description Uptime of the node.
             */
            uptime_sec: number;
            /** @description Validator id of the node */
            validator_account_id?: AccountId | null;
            /** @description Public key of the validator. */
            validator_public_key?: PublicKey | null;
            /** @description Current epoch validators. */
            validators: ValidatorInfo[];
            /** @description Binary version. */
            version: Version;
        } & {
            [key: string]: unknown;
        };
export type RpcTransactionResponse = ({
            final_execution_status: TxExecutionStatus;
        } & {
            [key: string]: unknown;
        }) | FinalExecutionOutcomeWithReceiptView | FinalExecutionOutcomeView;
export type RpcTransactionStatusRequest = ({
            /** @default EXECUTED_OPTIMISTIC */
            wait_until: TxExecutionStatus;
        } & {
            [key: string]: unknown;
        }) | ({
            signed_tx_base64: SignedTransaction;
        } & {
            [key: string]: unknown;
        }) | ({
            sender_account_id: AccountId;
            tx_hash: CryptoHash;
        } & {
            [key: string]: unknown;
        });
export type RpcValidatorRequest = "latest" | ({
            epoch_id: EpochId;
        } & {
            [key: string]: unknown;
        }) | ({
            block_id: BlockId;
        } & {
            [key: string]: unknown;
        });
export type RpcValidatorResponse = {
            /** @description Fishermen for the current epoch */
            current_fishermen: ValidatorStakeView[];
            /** @description Proposals in the current epoch */
            current_proposals: ValidatorStakeView[];
            /** @description Validators for the current epoch */
            current_validators: CurrentEpochValidatorInfo[];
            /**
             * Format: uint64
             * @description Epoch height
             */
            epoch_height: number;
            /**
             * Format: uint64
             * @description Epoch start block height
             */
            epoch_start_height: number;
            /** @description Fishermen for the next epoch */
            next_fishermen: ValidatorStakeView[];
            /** @description Validators for the next epoch */
            next_validators: NextEpochValidatorInfo[];
            /** @description Kickout in the previous epoch */
            prev_epoch_kickout: ValidatorKickoutView[];
        } & {
            [key: string]: unknown;
        };
export type RpcValidatorsOrderedRequest = {
            block_id?: BlockId | null;
        } & {
            [key: string]: unknown;
        };
export type RuntimeConfigView = {
            /** @description Config that defines rules for account creation. */
            account_creation_config: AccountCreationConfigView;
            /** @description The configuration for congestion control. */
            congestion_control_config: CongestionControlConfigView;
            /** @description Amount of yN per byte required to have on the account.  See
             *      <https://nomicon.io/Economics/Economic#state-stake> for details. */
            storage_amount_per_byte: string;
            /** @description Costs of different actions that need to be performed when sending and
             *      processing transaction and receipts. */
            transaction_costs: RuntimeFeesConfigView;
            /** @description Config of wasm operations. */
            wasm_config: VMConfigView;
            /** @description Configuration specific to ChunkStateWitness. */
            witness_config: WitnessConfigView;
        } & {
            [key: string]: unknown;
        };
export type RuntimeFeesConfigView = {
            /** @description Describes the cost of creating a certain action, `Action`. Includes all variants. */
            action_creation_config: ActionCreationConfigView;
            /** @description Describes the cost of creating an action receipt, `ActionReceipt`, excluding the actual cost
             *      of actions.
             *      - `send` cost is burned when a receipt is created using `promise_create` or
             *          `promise_batch_create`
             *      - `exec` cost is burned when the receipt is being executed. */
            action_receipt_creation_config: Fee;
            /** @description Fraction of the burnt gas to reward to the contract account for execution. */
            burnt_gas_reward: number[];
            /** @description Describes the cost of creating a data receipt, `DataReceipt`. */
            data_receipt_creation_config: DataReceiptCreationConfigView;
            /** @description Pessimistic gas price inflation ratio. */
            pessimistic_gas_price_inflation_ratio: number[];
            /** @description Describes fees for storage. */
            storage_usage_config: StorageUsageConfigView;
        } & {
            [key: string]: unknown;
        };
export type ShardId = number;
export type ShardLayout = ({
            V0: ShardLayoutV0;
        } & {
            [key: string]: unknown;
        }) | ({
            V1: ShardLayoutV1;
        } & {
            [key: string]: unknown;
        }) | ({
            V2: ShardLayoutV2;
        } & {
            [key: string]: unknown;
        });
export type ShardLayoutV0 = {
            /**
             * Format: uint64
             * @description Map accounts evenly across all shards
             */
            num_shards: number;
            /**
             * Format: uint32
             * @description Version of the shard layout, this is useful for uniquely identify the shard layout
             */
            version: number;
        } & {
            [key: string]: unknown;
        };
export type ShardLayoutV1 = {
            /** @description The boundary accounts are the accounts on boundaries between shards.
             *      Each shard contains a range of accounts from one boundary account to
             *      another - or the smallest or largest account possible. The total
             *      number of shards is equal to the number of boundary accounts plus 1. */
            boundary_accounts: AccountId[];
            /** @description Maps shards from the last shard layout to shards that it splits to in this shard layout,
             *      Useful for constructing states for the shards.
             *      None for the genesis shard layout */
            shards_split_map?: ShardId[][] | null;
            /** @description Maps shard in this shard layout to their parent shard
             *      Since shard_ids always range from 0 to num_shards - 1, we use vec instead of a hashmap */
            to_parent_shard_map?: ShardId[] | null;
            /**
             * Format: uint32
             * @description Version of the shard layout, this is useful for uniquely identify the shard layout
             */
            version: number;
        } & {
            [key: string]: unknown;
        };
export type ShardLayoutV2 = {
            boundary_accounts: AccountId[];
            id_to_index_map: {
                [key: string]: number;
            };
            index_to_id_map: {
                [key: string]: ShardId;
            };
            shard_ids: ShardId[];
            shards_parent_map?: {
                [key: string]: ShardId;
            } | null;
            shards_split_map?: {
                [key: string]: ShardId[];
            } | null;
            /** Format: uint32 */
            version: number;
        } & {
            [key: string]: unknown;
        };
export type ShardUId = {
            /** Format: uint32 */
            shard_id: number;
            /** Format: uint32 */
            version: number;
        } & {
            [key: string]: unknown;
        };
export type Signature = string;
export type SignedDelegateAction = {
            delegate_action: DelegateAction;
            signature: Signature;
        } & {
            [key: string]: unknown;
        };
export type SignedTransaction = string;
export type SignedTransactionView = {
            actions: ActionView[];
            hash: CryptoHash;
            /** Format: uint64 */
            nonce: number;
            /**
             * Format: uint64
             * @default 0
             */
            priority_fee: number;
            public_key: PublicKey;
            receiver_id: AccountId;
            signature: Signature;
            signer_id: AccountId;
        } & {
            [key: string]: unknown;
        };
export type SlashedValidator = {
            account_id: AccountId;
            is_double_sign: boolean;
        } & {
            [key: string]: unknown;
        };
export type StakeAction = {
            /** @description Validator key which will be used to sign transactions on behalf of signer_id */
            public_key: PublicKey;
            /** @description Amount of tokens to stake. */
            stake: string;
        } & {
            [key: string]: unknown;
        };
export type StateChangeCauseView = ({
            /** @enum {string} */
            type: "not_writable_to_disk";
        } & {
            [key: string]: unknown;
        }) | ({
            /** @enum {string} */
            type: "initial_state";
        } & {
            [key: string]: unknown;
        }) | ({
            tx_hash: CryptoHash;
            /** @enum {string} */
            type: "transaction_processing";
        } & {
            [key: string]: unknown;
        }) | ({
            receipt_hash: CryptoHash;
            /** @enum {string} */
            type: "action_receipt_processing_started";
        } & {
            [key: string]: unknown;
        }) | ({
            receipt_hash: CryptoHash;
            /** @enum {string} */
            type: "action_receipt_gas_reward";
        } & {
            [key: string]: unknown;
        }) | ({
            receipt_hash: CryptoHash;
            /** @enum {string} */
            type: "receipt_processing";
        } & {
            [key: string]: unknown;
        }) | ({
            receipt_hash: CryptoHash;
            /** @enum {string} */
            type: "postponed_receipt";
        } & {
            [key: string]: unknown;
        }) | ({
            /** @enum {string} */
            type: "updated_delayed_receipts";
        } & {
            [key: string]: unknown;
        }) | ({
            /** @enum {string} */
            type: "validator_accounts_update";
        } & {
            [key: string]: unknown;
        }) | ({
            /** @enum {string} */
            type: "migration";
        } & {
            [key: string]: unknown;
        }) | ({
            /** @enum {string} */
            type: "bandwidth_scheduler_state_update";
        } & {
            [key: string]: unknown;
        });
export type StateChangeKindView = ({
            account_id: AccountId;
            /** @enum {string} */
            type: "account_touched";
        } & {
            [key: string]: unknown;
        }) | ({
            account_id: AccountId;
            /** @enum {string} */
            type: "access_key_touched";
        } & {
            [key: string]: unknown;
        }) | ({
            account_id: AccountId;
            /** @enum {string} */
            type: "data_touched";
        } & {
            [key: string]: unknown;
        }) | ({
            account_id: AccountId;
            /** @enum {string} */
            type: "contract_code_touched";
        } & {
            [key: string]: unknown;
        });
export type StateChangeWithCauseView = ({
            cause: StateChangeCauseView;
        } & {
            [key: string]: unknown;
        }) & (({
            /** @description A view of the account */
            change: {
                account_id: AccountId;
                amount: string;
                code_hash: CryptoHash;
                global_contract_account_id?: AccountId | null;
                global_contract_hash?: CryptoHash | null;
                locked: string;
                /**
                 * Format: uint64
                 * @description TODO(2271): deprecated.
                 * @default 0
                 */
                storage_paid_at: number;
                /** Format: uint64 */
                storage_usage: number;
            } & {
                [key: string]: unknown;
            };
            /** @enum {string} */
            type: "account_update";
        } & {
            [key: string]: unknown;
        }) | ({
            change: {
                account_id: AccountId;
            } & {
                [key: string]: unknown;
            };
            /** @enum {string} */
            type: "account_deletion";
        } & {
            [key: string]: unknown;
        }) | ({
            change: {
                access_key: AccessKeyView;
                account_id: AccountId;
                public_key: PublicKey;
            } & {
                [key: string]: unknown;
            };
            /** @enum {string} */
            type: "access_key_update";
        } & {
            [key: string]: unknown;
        }) | ({
            change: {
                account_id: AccountId;
                public_key: PublicKey;
            } & {
                [key: string]: unknown;
            };
            /** @enum {string} */
            type: "access_key_deletion";
        } & {
            [key: string]: unknown;
        }) | ({
            change: {
                account_id: AccountId;
                gas_key: GasKeyView;
                public_key: PublicKey;
            } & {
                [key: string]: unknown;
            };
            /** @enum {string} */
            type: "gas_key_update";
        } & {
            [key: string]: unknown;
        }) | ({
            change: {
                account_id: AccountId;
                /** Format: uint32 */
                index: number;
                /** Format: uint64 */
                nonce: number;
                public_key: PublicKey;
            } & {
                [key: string]: unknown;
            };
            /** @enum {string} */
            type: "gas_key_nonce_update";
        } & {
            [key: string]: unknown;
        }) | ({
            change: {
                account_id: AccountId;
                public_key: PublicKey;
            } & {
                [key: string]: unknown;
            };
            /** @enum {string} */
            type: "gas_key_deletion";
        } & {
            [key: string]: unknown;
        }) | ({
            change: {
                account_id: AccountId;
                /** Format: bytes */
                key_base64: string;
                /** Format: bytes */
                value_base64: string;
            } & {
                [key: string]: unknown;
            };
            /** @enum {string} */
            type: "data_update";
        } & {
            [key: string]: unknown;
        }) | ({
            change: {
                account_id: AccountId;
                /** Format: bytes */
                key_base64: string;
            } & {
                [key: string]: unknown;
            };
            /** @enum {string} */
            type: "data_deletion";
        } & {
            [key: string]: unknown;
        }) | ({
            change: {
                account_id: AccountId;
                code_base64: string;
            } & {
                [key: string]: unknown;
            };
            /** @enum {string} */
            type: "contract_code_update";
        } & {
            [key: string]: unknown;
        }) | ({
            change: {
                account_id: AccountId;
            } & {
                [key: string]: unknown;
            };
            /** @enum {string} */
            type: "contract_code_deletion";
        } & {
            [key: string]: unknown;
        }));
export type StateItem = {
            /** Format: bytes */
            key: string;
            /** Format: bytes */
            value: string;
        } & {
            [key: string]: unknown;
        };
export type StateSyncConfig = {
            concurrency?: SyncConcurrency;
            /** @description `none` value disables state dump to external storage. */
            dump?: DumpConfig | null;
            sync?: SyncConfig;
        } & {
            [key: string]: unknown;
        };
export type StatusSyncInfo = {
            earliest_block_hash?: CryptoHash | null;
            /** Format: uint64 */
            earliest_block_height?: number | null;
            earliest_block_time?: string | null;
            epoch_id?: EpochId | null;
            /** Format: uint64 */
            epoch_start_height?: number | null;
            latest_block_hash: CryptoHash;
            /** Format: uint64 */
            latest_block_height: number;
            latest_block_time: string;
            latest_state_root: CryptoHash;
            syncing: boolean;
        } & {
            [key: string]: unknown;
        };
export type StorageError = "StorageInternalError" | ({
            MissingTrieValue: MissingTrieValue;
        } & {
            [key: string]: unknown;
        }) | "UnexpectedTrieValue" | ({
            StorageInconsistentState: string;
        } & {
            [key: string]: unknown;
        }) | ({
            FlatStorageBlockNotSupported: string;
        } & {
            [key: string]: unknown;
        }) | ({
            MemTrieLoadingError: string;
        } & {
            [key: string]: unknown;
        });
export type StorageGetMode = "FlatStorage" | "Trie";
export type StorageUsageConfigView = {
            /**
             * Format: uint64
             * @description Number of bytes for an account record, including rounding up for account id.
             */
            num_bytes_account: number;
            /**
             * Format: uint64
             * @description Additional number of bytes for a k/v record
             */
            num_extra_bytes_record: number;
        } & {
            [key: string]: unknown;
        };
export type SyncCheckpoint = "genesis" | "earliest_available";
export type SyncConcurrency = {
            /**
             * Format: uint8
             * @description Maximum number of "apply parts" tasks that can be performed in parallel.
             *      This is a very disk-heavy task and therefore we set this to a low limit,
             *      or else the rocksdb contention makes the whole server freeze up.
             */
            apply: number;
            /**
             * Format: uint8
             * @description Maximum number of "apply parts" tasks that can be performed in parallel
             *      during catchup. We set this to a very low value to avoid overloading the
             *      node while it is still performing normal tasks.
             */
            apply_during_catchup: number;
            /**
             * Format: uint8
             * @description Maximum number of outstanding requests for decentralized state sync.
             */
            peer_downloads: number;
            /**
             * Format: uint8
             * @description The maximum parallelism to use per shard. This is mostly for fairness, because
             *      the actual rate limiting is done by the TaskTrackers, but this is useful for
             *      balancing the shards a little.
             */
            per_shard: number;
        } & {
            [key: string]: unknown;
        };
export type SyncConfig = "Peers" | ({
            ExternalStorage: ExternalStorageConfig;
        } & {
            [key: string]: unknown;
        });
export type Tier1ProxyView = {
            addr: string;
            peer_id: PublicKey;
        } & {
            [key: string]: unknown;
        };
export type TrackedShardsConfig = "NoShards" | ({
            Shards: ShardUId[];
        } & {
            [key: string]: unknown;
        }) | "AllShards" | ({
            ShadowValidator: AccountId;
        } & {
            [key: string]: unknown;
        }) | ({
            Schedule: ShardId[][];
        } & {
            [key: string]: unknown;
        }) | ({
            Accounts: AccountId[];
        } & {
            [key: string]: unknown;
        });
export type TransferAction = {
            deposit: string;
        } & {
            [key: string]: unknown;
        };
export type TxExecutionError = ({
            ActionError: ActionError;
        } & {
            [key: string]: unknown;
        }) | ({
            InvalidTxError: InvalidTxError;
        } & {
            [key: string]: unknown;
        });
export type TxExecutionStatus = "NONE" | "INCLUDED" | "EXECUTED_OPTIMISTIC" | "INCLUDED_FINAL" | "EXECUTED" | "FINAL";
export type UseGlobalContractAction = {
            contract_identifier: GlobalContractIdentifier;
        } & {
            [key: string]: unknown;
        };
export type ValidatorInfo = {
            account_id: AccountId;
        } & {
            [key: string]: unknown;
        };
export type ValidatorKickoutReason = "_UnusedSlashed" | ({
            NotEnoughBlocks: {
                /** Format: uint64 */
                expected: number;
                /** Format: uint64 */
                produced: number;
            } & {
                [key: string]: unknown;
            };
        } & {
            [key: string]: unknown;
        }) | ({
            NotEnoughChunks: {
                /** Format: uint64 */
                expected: number;
                /** Format: uint64 */
                produced: number;
            } & {
                [key: string]: unknown;
            };
        } & {
            [key: string]: unknown;
        }) | "Unstaked" | ({
            NotEnoughStake: {
                stake_u128: string;
                threshold_u128: string;
            } & {
                [key: string]: unknown;
            };
        } & {
            [key: string]: unknown;
        }) | "DidNotGetASeat" | ({
            NotEnoughChunkEndorsements: {
                /** Format: uint64 */
                expected: number;
                /** Format: uint64 */
                produced: number;
            } & {
                [key: string]: unknown;
            };
        } & {
            [key: string]: unknown;
        }) | ({
            ProtocolVersionTooOld: {
                /** Format: uint32 */
                network_version: number;
                /** Format: uint32 */
                version: number;
            } & {
                [key: string]: unknown;
            };
        } & {
            [key: string]: unknown;
        });
export type ValidatorKickoutView = {
            account_id: AccountId;
            reason: ValidatorKickoutReason;
        } & {
            [key: string]: unknown;
        };
export type ValidatorStakeView = ({
            /** @enum {string} */
            validator_stake_struct_version: "V1";
        } & {
            [key: string]: unknown;
        }) & ValidatorStakeViewV1;
export type ValidatorStakeViewV1 = {
            account_id: AccountId;
            public_key: PublicKey;
            stake: string;
        } & {
            [key: string]: unknown;
        };
export type Version = {
            build: string;
            commit: string;
            /** @default  */
            rustc_version: string;
            version: string;
        } & {
            [key: string]: unknown;
        };
export type ViewStateResult = {
            proof?: string[];
            values: StateItem[];
        } & {
            [key: string]: unknown;
        };
export type VMConfigView = {
            /** @description See [VMConfig::discard_custom_sections](crate::vm::Config::discard_custom_sections). */
            discard_custom_sections: boolean;
            /** @description See [VMConfig::eth_implicit_accounts](crate::vm::Config::eth_implicit_accounts). */
            eth_implicit_accounts: boolean;
            /** @description Costs for runtime externals */
            ext_costs: ExtCostsConfigView;
            /** @description See [VMConfig::fix_contract_loading_cost](crate::vm::Config::fix_contract_loading_cost). */
            fix_contract_loading_cost: boolean;
            /** @description See [VMConfig::global_contract_host_fns](crate::vm::Config::global_contract_host_fns). */
            global_contract_host_fns: boolean;
            /**
             * Format: uint32
             * @description Gas cost of a growing memory by single page.
             */
            grow_mem_cost: number;
            /** @description See [VMConfig::implicit_account_creation](crate::vm::Config::implicit_account_creation). */
            implicit_account_creation: boolean;
            /** @description Describes limits for VM and Runtime.
             *
             *      TODO: Consider changing this to `VMLimitConfigView` to avoid dependency
             *      on runtime. */
            limit_config: LimitConfig;
            /** @description See [VMConfig::reftypes_bulk_memory](crate::vm::Config::reftypes_bulk_memory). */
            reftypes_bulk_memory: boolean;
            /**
             * Format: uint32
             * @description Gas cost of a regular operation.
             */
            regular_op_cost: number;
            /** @description See [VMConfig::saturating_float_to_int](crate::vm::Config::saturating_float_to_int). */
            saturating_float_to_int: boolean;
            /** @description See [VMConfig::storage_get_mode](crate::vm::Config::storage_get_mode). */
            storage_get_mode: StorageGetMode;
            /** @description See [VMConfig::vm_kind](crate::vm::Config::vm_kind). */
            vm_kind: VMKind;
        } & {
            [key: string]: unknown;
        };
export type VMKind = "Wasmer0" | "Wasmtime" | "Wasmer2" | "NearVm" | "NearVm2";
export type WasmTrap = "Unreachable" | "IncorrectCallIndirectSignature" | "MemoryOutOfBounds" | "CallIndirectOOB" | "IllegalArithmetic" | "MisalignedAtomicAccess" | "IndirectCallToNull" | "StackOverflow" | "GenericTrap";
export type WitnessConfigView = {
            /**
             * Format: uint
             * @description Maximum size of transactions contained inside ChunkStateWitness.
             *
             *      A witness contains transactions from both the previous chunk and the current one.
             *      This parameter limits the sum of sizes of transactions from both of those chunks.
             */
            combined_transactions_size_limit: number;
            /**
             * Format: uint64
             * @description Size limit for storage proof generated while executing receipts in a chunk.
             *      After this limit is reached we defer execution of any new receipts.
             */
            main_storage_proof_size_soft_limit: number;
            /**
             * Format: uint64
             * @description Soft size limit of storage proof used to validate new transactions in ChunkStateWitness.
             */
            new_transactions_validation_state_size_soft_limit: number;
        } & {
            [key: string]: unknown;
        };
