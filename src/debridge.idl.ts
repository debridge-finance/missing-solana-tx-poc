export type DebridgeProgram = {
    version: "1.0.1";
    name: "debridge_program";
    docs: [
        "The 'debridge_program' is Solana program provider pub API for deBridge Protocol",
        "For security reasons, ownership of the main structures is carried out from this program.",
        "",
        "There are several roles for this module.",
        '- "👤 User" - user of our Protocol',
        '- "👤 Claimer" - claimer which performs actions for the 👤 User',
        '- "👤 Executor" - executor which performs actions for the 👤 User',
        '- "👤 Protocol Authority" - multi-signature account with extra privilege for setup protocol settings',
    ];
    instructions: [
        {
            name: "initNonceMaster";
            accounts: [
                {
                    name: "nonceStorage";
                    isMut: true;
                    isSigner: false;
                    docs: ["The task of this account is to store the Nonce, which is necessary for the uniqueness of each Send"];
                },
                {
                    name: "payer";
                    isMut: true;
                    isSigner: true;
                },
                {
                    name: "systemProgram";
                    isMut: false;
                    isSigner: false;
                },
            ];
            args: [];
        },
        {
            name: "send";
            docs: [
                "Sends user's token to other chain",
                "",
                "The function sends tokens to staking, takes fee, and emits an event for sending tokens",
                "",
                "# Arguments",
                "* `target_chain_id` - target chain id",
                "* `receiver` - user address in target chain for tokens receiving",
                "* `is_use_asset_fee` - determines how the fee will be paid. True: sending tokens, false: Sol",
                "* `amount` - the number of tokens that the user sends",
                "* `submissions_param` - additional data for tokens sending with auto external execution",
                "",
                "# Events",
                "* [`events::Transferred`]",
                "",
                "# Roles",
                '* "👤 User"',
            ];
            accounts: [
                {
                    name: "bridgeCtx";
                    accounts: [
                        {
                            name: "bridge";
                            isMut: true;
                            isSigner: false;
                            docs: [
                                "The account contains all the information about the operation of the bridge",
                                "",
                                "There are the address of the token with which the bridge works,",
                                "the amount of liquidity stored, the collected fee amount and",
                                "the settings for the operation of the bridge",
                            ];
                        },
                        {
                            name: "tokenMint";
                            isMut: true;
                            isSigner: false;
                            docs: ["The mint account of the token with which the bridge works"];
                        },
                        {
                            name: "stakingWallet";
                            isMut: true;
                            isSigner: false;
                            docs: [
                                "The account stores the user's staking tokens and the fee collected by the bridge in tokens",
                                "",
                                "Verification of account takes place in [`Sending::send_token`] and [`Claiming::process_token`]",
                            ];
                        },
                        {
                            name: "mintAuthority";
                            isMut: false;
                            isSigner: false;
                            docs: [
                                "The PDA that is the authorization for the transfer of tokens to the user",
                                "",
                                "It's wrapper token mint authority account for mint bridge,",
                                "staking token account owner for send bridge and changing",
                                "balance in bridge_data",
                            ];
                        },
                        {
                            name: "chainSupportInfo";
                            isMut: false;
                            isSigner: false;
                            docs: ["The account that stores support and fee information for a specific chain"];
                        },
                        {
                            name: "settingsProgram";
                            isMut: false;
                            isSigner: false;
                            docs: ["Debridge settings  program"];
                        },
                        {
                            name: "splTokenProgram";
                            isMut: false;
                            isSigner: false;
                            docs: ["System spl token program"];
                        },
                    ];
                },
                {
                    name: "stateCtx";
                    accounts: [
                        {
                            name: "state";
                            isMut: true;
                            isSigner: false;
                            docs: [
                                "State account with service information",
                                "",
                                "This account from settings program is also a unique state for debridge program.",
                            ];
                        },
                        {
                            name: "feeBeneficiary";
                            isMut: true;
                            isSigner: false;
                            docs: [
                                "Beneficiary of the commission in the system",
                                "",
                                "The unique value of this account is stored in the state account",
                                "Implied that this will be an account belonging to another program (FeeProxy),",
                                "which will be responsible for the distribution of commissions",
                            ];
                        },
                    ];
                },
                {
                    name: "nonceStorage";
                    isMut: true;
                    isSigner: false;
                    docs: ["The task of this account is to store the Nonce, which is necessary for the uniqueness of each Send"];
                },
                {
                    name: "sendFromWallet";
                    isMut: true;
                    isSigner: false;
                    docs: ["👤 User token account from which money is sent"];
                },
                {
                    name: "systemProgram";
                    isMut: false;
                    isSigner: false;
                    docs: ["Solana system program"];
                },
                {
                    name: "externalCallStorage";
                    isMut: true;
                    isSigner: false;
                    docs: [
                        "Storage for external call instructions",
                        "",
                        "The key is checked after calculating the Submission id",
                        "It has [`ExternalCallMeta'] structure and is initialized when `submission_params` is not None.",
                        "If `submission_params` is None this account is ignored",
                    ];
                },
                {
                    name: "externalCallMeta";
                    isMut: true;
                    isSigner: false;
                    docs: [
                        "The account that stores information about external call current state.",
                        "",
                        "It has [`ExternalCallMeta'] structure and is initialized when `submission_params` is not None.",
                        "If `submission_params` is None this account is ignored",
                    ];
                },
                {
                    name: "sendFrom";
                    isMut: true;
                    isSigner: true;
                    docs: ["👤 User Authority"];
                },
                {
                    name: "discount";
                    isMut: false;
                    isSigner: false;
                    docs: ["The account allows the user to get a discount when using the bridge"];
                },
                {
                    name: "bridgeFee";
                    isMut: false;
                    isSigner: false;
                    docs: [
                        "The account determines whether it is possible to take fix fee from sending tokens",
                        "and the percentage of these tokens. Otherwise fix fee in SOL is taken",
                    ];
                },
            ];
            args: [
                {
                    name: "targetChainId";
                    type: {
                        array: ["u8", 32];
                    };
                },
                {
                    name: "receiver";
                    type: "bytes";
                },
                {
                    name: "isUseAssetFee";
                    type: "bool";
                },
                {
                    name: "amount";
                    type: "u64";
                },
                {
                    name: "submissionParams";
                    type: {
                        option: {
                            defined: "SendSubmissionParamsInput";
                        };
                    };
                },
                {
                    name: "referralCode";
                    type: {
                        option: "u32";
                    };
                },
            ];
        },
        {
            name: "claim";
            docs: [
                "Claims user's token from other chain",
                "",
                "The function checks that the submission is valid and sends tokens to the user.",
                "The function can also send tokens through a call proxy to perform additional actions",
                "",
                "# Arguments",
                "* `source_chain_id` - source chain id",
                "* `raw_amount` - the number of tokens that the user claims",
                "* `nonce` - a unique number that makes the submission unique",
                "* `submissions_param` - additional data for tokens claiming with auto external execution",
                "",
                "# Events",
                "* [`events::Bridged`]",
                "",
                "# Roles",
                '* "👤 Claimer"',
            ];
            accounts: [
                {
                    name: "submission";
                    isMut: true;
                    isSigner: false;
                    docs: [
                        "The account determines whether tokens have been claimed based on the received submission",
                        "",
                        "If this account based on the submission ID exists, then the claim was performed earlier",
                        "seeds of this account is `[SUBMISSION_SEED, &submission_id]`. We check them during the creation",
                        "of the `submission`, since at that stage we already have a calculated submission id",
                    ];
                },
                {
                    name: "bridgeCtx";
                    accounts: [
                        {
                            name: "bridge";
                            isMut: true;
                            isSigner: false;
                            docs: [
                                "The account contains all the information about the operation of the bridge",
                                "",
                                "There are the address of the token with which the bridge works,",
                                "the amount of liquidity stored, the collected fee amount and",
                                "the settings for the operation of the bridge",
                            ];
                        },
                        {
                            name: "tokenMint";
                            isMut: true;
                            isSigner: false;
                            docs: ["The mint account of the token with which the bridge works"];
                        },
                        {
                            name: "stakingWallet";
                            isMut: true;
                            isSigner: false;
                            docs: [
                                "The account stores the user's staking tokens and the fee collected by the bridge in tokens",
                                "",
                                "Verification of account takes place in [`Sending::send_token`] and [`Claiming::process_token`]",
                            ];
                        },
                        {
                            name: "mintAuthority";
                            isMut: false;
                            isSigner: false;
                            docs: [
                                "The PDA that is the authorization for the transfer of tokens to the user",
                                "",
                                "It's wrapper token mint authority account for mint bridge,",
                                "staking token account owner for send bridge and changing",
                                "balance in bridge_data",
                            ];
                        },
                        {
                            name: "chainSupportInfo";
                            isMut: false;
                            isSigner: false;
                            docs: ["The account that stores support and fee information for a specific chain"];
                        },
                        {
                            name: "settingsProgram";
                            isMut: false;
                            isSigner: false;
                            docs: ["Debridge settings  program"];
                        },
                        {
                            name: "splTokenProgram";
                            isMut: false;
                            isSigner: false;
                            docs: ["System spl token program"];
                        },
                    ];
                },
                {
                    name: "state";
                    accounts: [
                        {
                            name: "state";
                            isMut: true;
                            isSigner: false;
                            docs: [
                                "State account with service information",
                                "",
                                "This account from settings program is also a unique state for debridge program.",
                            ];
                        },
                        {
                            name: "feeBeneficiary";
                            isMut: true;
                            isSigner: false;
                            docs: [
                                "Beneficiary of the commission in the system",
                                "",
                                "The unique value of this account is stored in the state account",
                                "Implied that this will be an account belonging to another program (FeeProxy),",
                                "which will be responsible for the distribution of commissions",
                            ];
                        },
                    ];
                },
                {
                    name: "claimToWallet";
                    isMut: true;
                    isSigner: false;
                    docs: [
                        "On this account the claimed tokens will be transferred.",
                        "",
                        "If claim with external call this account is associated with submission auth account wallet",
                        "If claim without external call this account is associated with claim_to_wallet account wallet or",
                        "if claim_to is Token account itself this account is same as claim_to",
                    ];
                },
                {
                    name: "claimTo";
                    isMut: false;
                    isSigner: false;
                    docs: ["It's account that marked in Submission structure as receiver"];
                },
                {
                    name: "fallbackAddress";
                    isMut: false;
                    isSigner: false;
                },
                {
                    name: "confirmationStorage";
                    isMut: true;
                    isSigner: false;
                    docs: [
                        "The account that stores information about signatures confirming the existence of a submission",
                        "After use, signatures are removed from the storage",
                    ];
                },
                {
                    name: "confirmationStorageCreator";
                    isMut: true;
                    isSigner: false;
                },
                {
                    name: "payer";
                    isMut: true;
                    isSigner: true;
                    docs: ["👤 Claimer"];
                },
                {
                    name: "payerWallet";
                    isMut: true;
                    isSigner: false;
                    docs: ["The wallet owned by payer account. On this account the executor fee will be transferred"];
                },
                {
                    name: "systemProgram";
                    isMut: false;
                    isSigner: false;
                    docs: ["Solana system program"];
                },
                {
                    name: "externalCallStorage";
                    isMut: true;
                    isSigner: false;
                    docs: [
                        "Storage for external call instructions",
                        "",
                        "The key is checked after calculating the Submission id",
                        "It has [`ExternalCallMeta'] structure and is initialized when `submission_params` is not None.",
                        "If `submission_params` is None this account is ignored",
                    ];
                },
                {
                    name: "externalCallMeta";
                    isMut: true;
                    isSigner: false;
                    docs: [
                        "The account that stores information about external call current state.",
                        "",
                        "It has [`ExternalCallMeta'] structure and is initialized when `submission_params` is not None.",
                        "If `submission_params` is None this account is ignored",
                    ];
                },
                {
                    name: "claimMarker";
                    isMut: false;
                    isSigner: false;
                },
            ];
            args: [
                {
                    name: "sourceChainId";
                    type: {
                        array: ["u8", 32];
                    };
                },
                {
                    name: "rawAmount";
                    type: {
                        array: ["u8", 32];
                    };
                },
                {
                    name: "nonce";
                    type: {
                        array: ["u8", 32];
                    };
                },
                {
                    name: "submissionsParam";
                    type: {
                        option: {
                            defined: "ClaimSubmissionParamsInput";
                        };
                    };
                },
            ];
        },
        {
            name: "withdrawBridgeFee";
            docs: [
                "Withdraws fee from the bridge",
                "",
                "Send all fee that bridge collected to the fee_beneficiar_wallet",
                "we create a temporary storage for verified oracle keys that have already signed the message",
                "",
                "# Roles",
                "👤 Protocol Authority",
            ];
            accounts: [
                {
                    name: "stateCtx";
                    accounts: [
                        {
                            name: "state";
                            isMut: true;
                            isSigner: false;
                            docs: [
                                "State account with service information",
                                "",
                                "This account from settings program is also a unique state for debridge program.",
                            ];
                        },
                        {
                            name: "feeBeneficiary";
                            isMut: true;
                            isSigner: false;
                            docs: [
                                "Beneficiary of the commission in the system",
                                "",
                                "The unique value of this account is stored in the state account",
                                "Implied that this will be an account belonging to another program (FeeProxy),",
                                "which will be responsible for the distribution of commissions",
                            ];
                        },
                    ];
                },
                {
                    name: "tokenMint";
                    isMut: true;
                    isSigner: false;
                    docs: ["The mint account of the token with which the bridge works"];
                },
                {
                    name: "bridgeData";
                    isMut: true;
                    isSigner: false;
                    docs: [
                        "The account contains all the information about the operation of the bridge",
                        "",
                        "There are the address of the token with which the bridge works,",
                        "the amount of liquidity stored, the collected fee amount and",
                        "the settings for the operation of the bridge",
                    ];
                },
                {
                    name: "stakingWallet";
                    isMut: true;
                    isSigner: false;
                    docs: ["The account stores the user's staking tokens and the fee collected by the bridge in tokens"];
                },
                {
                    name: "mintAuthority";
                    isMut: false;
                    isSigner: false;
                    docs: [
                        "The PDA that is the authorization for the transfer of tokens to the user",
                        "",
                        "It's wrapper token mint authority account for mint bridge,",
                        "staking token account owner for send bridge and changing",
                        "balance in bridge_data",
                    ];
                },
                {
                    name: "feeBeneficiarWallet";
                    isMut: true;
                    isSigner: false;
                    docs: ["The token account owned by fee beneficiary. Fee is sent to this wallet"];
                },
                {
                    name: "tokenProgram";
                    isMut: false;
                    isSigner: false;
                    docs: ["System spl token program"];
                },
                {
                    name: "settingsProgram";
                    isMut: false;
                    isSigner: false;
                    docs: ["Debridge settings  program"];
                },
            ];
            args: [];
        },
        {
            name: "initExternalCallStorage";
            docs: [
                "Initializing of external call storage",
                "",
                "Due to restrictions on the size of transactions, each claimer initializes its storage for such data",
                "This information is used in [`claim`] by this claimer. If it was the first and everything went",
                "well (successfully claimed), then this store is locked until it has been execute.",
                "Once locked, any executor can execute it",
                "",
                "After complete execute of the external data - the account can be closed with full rent refund",
                "If your claim was unsuccessful, you can close this account at any time with full rent refund",
                "",
                "# Arguments",
                "* `external_call_len` - service information about [`InitExternalCallStorage::external_call_storage`] pubkey",
                "* `is_claim_storage` - define that it is storage for claim or send functions",
                "* `chain_id` - source chain id if it is claim storage and target chain id if it is send storage",
                "* `storage_key` - for [`send`] this is (shortcut)[SendSubmissionParamsInput::external_call_shortcut]",
                "for [`claim`] this is `submission_id` (for details looks at [`submission`] crate",
                "* `raw_instructions` - part of instructions of external call",
                "",
                "# Roles",
                "👤 Claimer",
            ];
            accounts: [
                {
                    name: "externalCallStorage";
                    isMut: true;
                    isSigner: false;
                    docs: [
                        "Storage for external call instructions",
                        "",
                        "The key is checked after calculating the Submission id",
                        "",
                        "Due to the restrictions on the size of the transaction, we allocate storage for the entire external call in [`claim`] or [`send`] action",
                        "Each storage owner creates his own repository, since validation of this storage is possible only when it is completely full",
                    ];
                },
                {
                    name: "externalCallMeta";
                    isMut: true;
                    isSigner: false;
                    docs: ["The account that stores information about external call current state"];
                },
                {
                    name: "storageOwner";
                    isMut: true;
                    isSigner: true;
                    docs: ["👤 Claimer"];
                },
                {
                    name: "systemProgram";
                    isMut: false;
                    isSigner: false;
                    docs: ["Solana system program"];
                },
            ];
            args: [
                {
                    name: "externalCallLen";
                    type: "u32";
                },
                {
                    name: "chainId";
                    type: {
                        array: ["u8", 32];
                    };
                },
                {
                    name: "storageKey";
                    type: {
                        array: ["u8", 32];
                    };
                },
                {
                    name: "rawInstructions";
                    type: "bytes";
                },
            ];
        },
        {
            name: "updateExternalCallStorage";
            docs: [
                "Add instructions to external call storage",
                "",
                "This method will be used if all external data does not fit into one transaction and after",
                "[`init_external_call_storage` you can use this method for add additional data",
                "",
                "Due to restrictions on the size of transactions, each claimer initializes its storage for such data",
                "This information is used in [`claim`] by this claimer. If it was the first and everything went",
                "well (successfully claimed), then this store is locked until it has been execute.",
                "Once locked, any executor can execute it",
                "",
                "After complete execute of the external data - the account can be closed with full rent refund",
                "If your claim was unsuccessful, you can close this account at any time with full rent refund",
                "",
                "# Arguments",
                "* `chain_id` - chain id. `SOLANA_CHAIN_ID` for `send` & `source_chain_id` for `claim` storage",
                "* `submission_id` - this account is uniquely tied to the submission_id and when claimer try to claim, a check for compliance will be performed",
                "* `external_instructions_offset` - offset to the part of storage where raw instructions will be write",
                "* `raw_instructions` - part of instructions of external call",
                "",
                "# Roles",
                "👤 Claimer",
            ];
            accounts: [
                {
                    name: "externalCallStorage";
                    isMut: true;
                    isSigner: false;
                    docs: [
                        "Storage for external call instructions",
                        "",
                        "The key is checked after calculating the Submission id",
                        "The account that stores information about external call current state.",
                    ];
                },
                {
                    name: "externalCallMeta";
                    isMut: true;
                    isSigner: false;
                },
                {
                    name: "claimer";
                    isMut: true;
                    isSigner: true;
                    docs: ["👤 Executor"];
                },
                {
                    name: "systemProgram";
                    isMut: false;
                    isSigner: false;
                    docs: ["Solana system program"];
                },
            ];
            args: [
                {
                    name: "chainId";
                    type: {
                        array: ["u8", 32];
                    };
                },
                {
                    name: "submissionId";
                    type: {
                        array: ["u8", 32];
                    };
                },
                {
                    name: "externalInstructionsOffset";
                    type: "u64";
                },
                {
                    name: "rawInstructions";
                    type: "bytes";
                },
            ];
        },
        {
            name: "closeExternalCallStorage";
            docs: [
                "Close external call storage account and return rent to claimer",
                "",
                "If this external_data was not used to claim, you can close your storage and completely delete this account.",
                "If the data was used for a [`claim`], then the account will be deleted automatically as soon as the external",
                "data is fully executed",
                "",
                "# Arguments",
                "* `source_chain_id` - source chain id",
                "* `submission_id` - this account is uniquely tied to the submission_id and when claimer try to claim, a check for compliance will be performed",
                "",
                "# Roles",
                "👤 Claimer",
            ];
            accounts: [
                {
                    name: "externalCallStorage";
                    isMut: true;
                    isSigner: false;
                    docs: [
                        "Storage for external call instructions",
                        "",
                        "The key is checked after calculating the Submission id",
                        "The account that stores information about external call current state.",
                    ];
                },
                {
                    name: "externalCallMeta";
                    isMut: true;
                    isSigner: false;
                },
                {
                    name: "claimer";
                    isMut: true;
                    isSigner: true;
                    docs: ["👤 Executor"];
                },
                {
                    name: "systemProgram";
                    isMut: false;
                    isSigner: false;
                    docs: ["Solana system program"];
                },
            ];
            args: [
                {
                    name: "chainId";
                    type: {
                        array: ["u8", 32];
                    };
                },
                {
                    name: "submissionId";
                    type: {
                        array: ["u8", 32];
                    };
                },
            ];
        },
        {
            name: "executeExternalCall";
            docs: [
                "Execute external call data for confirmed submission",
                "",
                "Due to restrictions on the size of transactions, each claimer initializes its storage for such data",
                "This information is used in [`claim`] by this claimer. If it was the first and everything went",
                "well (successfully claimed), then this store is locked until it has been execute.",
                "Once locked, any executor can execute it",
                "",
                "After complete execute of the external data - `external_call_storage` account can be automatically closed with full rent refund",
                "to original claimer",
                "",
                "# Arguments",
                "* `submission_id` - this account is uniquely tied to the submission_id and when claimer try to claim, a check for compliance will be performed",
                "* `count` - the number of instructions that we will execute. Executor must compute the optimal count so as not to",
                "overflow computational resource constraints",
                "* `subsitution_bumps` - TODO",
                "",
                "# Roles",
                "👤 Executor",
            ];
            accounts: [
                {
                    name: "state";
                    isMut: false;
                    isSigner: false;
                    docs: [
                        "State account with service information",
                        "",
                        "This account from settings program is also a unique state for debridge program.",
                    ];
                },
                {
                    name: "externalCallStorage";
                    isMut: true;
                    isSigner: false;
                    docs: [
                        "External call storage",
                        "",
                        "This account stored all external_data for `submission_id` and verified by [`claim`] method",
                    ];
                },
                {
                    name: "externalCallMeta";
                    isMut: true;
                    isSigner: false;
                    docs: ["The account that stores information about external call current state"];
                },
                {
                    name: "bridge";
                    isMut: true;
                    isSigner: false;
                    docs: ["Bridge for this submission", "", "Use here for check wallet"];
                },
                {
                    name: "originalClaimer";
                    isMut: true;
                    isSigner: false;
                    docs: ["Claimer who has successfully call [`claim`].", "Here this account is used to verify `external_call_storage`"];
                },
                {
                    name: "submission";
                    isMut: false;
                    isSigner: false;
                    docs: ["An account proving that the transfer was made and with information", "about `original_claimer` account"];
                },
                {
                    name: "submissionAuth";
                    isMut: true;
                    isSigner: false;
                    docs: ["Submission wallet owner"];
                },
                {
                    name: "submissionWallet";
                    isMut: true;
                    isSigner: false;
                    docs: ["Temporary wallet for storing funds during an external call"];
                },
                {
                    name: "rewardBeneficiaryWallet";
                    isMut: true;
                    isSigner: false;
                    docs: ["The wallet of the executor that will receive the reward"];
                },
                {
                    name: "executor";
                    isMut: false;
                    isSigner: true;
                    docs: ['- "👤 Executor"'];
                },
                {
                    name: "fallbackAddress";
                    isMut: true;
                    isSigner: false;
                },
                {
                    name: "fallbackAddressWallet";
                    isMut: true;
                    isSigner: false;
                    docs: [
                        "In case of unsuccessful execution of one of the instructions for any reason,",
                        "the remaining tokens and the remaining rewards should come to this address",
                        "The wallet of `fallback_address` account",
                    ];
                },
                {
                    name: "tokenMint";
                    isMut: true;
                    isSigner: false;
                    docs: ["The mint account of the token with which the bridge works"];
                },
                {
                    name: "systemProgram";
                    isMut: false;
                    isSigner: false;
                    docs: ["Solana system program"];
                },
                {
                    name: "splTokenProgram";
                    isMut: false;
                    isSigner: false;
                    docs: ["System spl token program"];
                },
            ];
            args: [
                {
                    name: "submissionId";
                    type: {
                        array: ["u8", 32];
                    };
                },
                {
                    name: "count";
                    type: "u8";
                },
                {
                    name: "reversedSubsitutionBumps";
                    type: "bytes";
                },
            ];
        },
        {
            name: "makeFallbackForExternalCall";
            accounts: [
                {
                    name: "state";
                    isMut: false;
                    isSigner: false;
                    docs: [
                        "State account with service information",
                        "",
                        "This account from settings program is also a unique state for debridge program.",
                    ];
                },
                {
                    name: "externalCallStorage";
                    isMut: true;
                    isSigner: false;
                    docs: [
                        "External call storage",
                        "",
                        "This account stored all external_data for `submission_id` and verified by [`claim`] method",
                    ];
                },
                {
                    name: "externalCallMeta";
                    isMut: true;
                    isSigner: false;
                    docs: ["The account that stores information about external call current state"];
                },
                {
                    name: "bridge";
                    isMut: true;
                    isSigner: false;
                    docs: ["Bridge for this submission", "", "Use here for check wallet"];
                },
                {
                    name: "originalClaimer";
                    isMut: true;
                    isSigner: false;
                    docs: ["Claimer who has successfully call [`claim`].", "Here this account is used to verify `external_call_storage`"];
                },
                {
                    name: "submission";
                    isMut: false;
                    isSigner: false;
                    docs: ["An account proving that the transfer was made and with information", "about `original_claimer` account"];
                },
                {
                    name: "submissionAuth";
                    isMut: true;
                    isSigner: false;
                    docs: ["Submission wallet owner"];
                },
                {
                    name: "submissionWallet";
                    isMut: true;
                    isSigner: false;
                    docs: ["Temporary wallet for storing funds during an external call"];
                },
                {
                    name: "rewardBeneficiaryWallet";
                    isMut: true;
                    isSigner: false;
                    docs: ["The wallet of the executor that will receive the reward"];
                },
                {
                    name: "executor";
                    isMut: false;
                    isSigner: true;
                    docs: ['- "👤 Executor"'];
                },
                {
                    name: "fallbackAddress";
                    isMut: true;
                    isSigner: false;
                },
                {
                    name: "fallbackAddressWallet";
                    isMut: true;
                    isSigner: false;
                    docs: [
                        "In case of unsuccessful execution of one of the instructions for any reason,",
                        "the remaining tokens and the remaining rewards should come to this address",
                        "The wallet of `fallback_address` account",
                    ];
                },
                {
                    name: "tokenMint";
                    isMut: true;
                    isSigner: false;
                    docs: ["The mint account of the token with which the bridge works"];
                },
                {
                    name: "systemProgram";
                    isMut: false;
                    isSigner: false;
                    docs: ["Solana system program"];
                },
                {
                    name: "splTokenProgram";
                    isMut: false;
                    isSigner: false;
                    docs: ["System spl token program"];
                },
            ];
            args: [
                {
                    name: "submissionId";
                    type: {
                        array: ["u8", 32];
                    };
                },
                {
                    name: "submissionAuthBump";
                    type: "u8";
                },
            ];
        },
        {
            name: "closeSubmissionAuthWallet";
            accounts: [
                {
                    name: "originalClaimer";
                    isMut: true;
                    isSigner: false;
                    docs: ["Claimer who has successfully call [`claim`].", "Here this account is used to verify `external_call_storage`"];
                },
                {
                    name: "submission";
                    isMut: false;
                    isSigner: false;
                    docs: ["An account proving that the transfer was made and with information", "about `original_claimer` account"];
                },
                {
                    name: "submissionAuth";
                    isMut: true;
                    isSigner: false;
                    docs: ["Submission wallet owner"];
                },
                {
                    name: "submissionAuthLostWallet";
                    isMut: true;
                    isSigner: false;
                    docs: ["Temporary wallet for storing funds in process of execution of external call"];
                },
                {
                    name: "externalCallStorage";
                    isMut: false;
                    isSigner: false;
                    docs: [
                        "External call storage",
                        "",
                        "This account stored all external_data for `submission_id` and verified by [`claim`] method",
                    ];
                },
                {
                    name: "externalCallMeta";
                    isMut: true;
                    isSigner: false;
                    docs: ["The account that stores information about external call current state"];
                },
                {
                    name: "fallbackAddressWallet";
                    isMut: true;
                    isSigner: false;
                    docs: [
                        "In case of unsuccessful execution of one of the instructions for any reason,",
                        "the remaining tokens and the remaining rewards should come to this address",
                        "The wallet of `fallback_address` account",
                    ];
                },
                {
                    name: "tokenMint";
                    isMut: false;
                    isSigner: false;
                },
                {
                    name: "splTokenProgram";
                    isMut: false;
                    isSigner: false;
                    docs: ["System spl token program"];
                },
            ];
            args: [
                {
                    name: "submissionId";
                    type: {
                        array: ["u8", 32];
                    };
                },
                {
                    name: "submissionAuthBump";
                    type: "u8";
                },
            ];
        },
    ];
    accounts: [
        {
            name: "claimMarker";
            type: {
                kind: "struct";
                fields: [];
            };
        },
        {
            name: "externalCallMeta";
            type: {
                kind: "struct";
                fields: [
                    {
                        name: "data";
                        type: {
                            defined: "ExternalCallMetaVariants";
                        };
                    },
                    {
                        name: "externalCallStorageBump";
                        type: "u8";
                    },
                    {
                        name: "bump";
                        type: "u8";
                    },
                ];
            };
        },
        {
            name: "externalCallStorage";
            type: {
                kind: "struct";
                fields: [];
            };
        },
        {
            name: "nonceMaster";
            type: {
                kind: "struct";
                fields: [
                    {
                        name: "nonce";
                        type: "u64";
                    },
                ];
            };
        },
        {
            name: "submissionAccount";
            docs: [
                "The existence of this account proves the fact that the transfer",
                "was made and it is confirmed on the network",
                "",
                "It stores the claimer for validation when executing external data",
            ];
            type: {
                kind: "struct";
                fields: [
                    {
                        name: "claimer";
                        type: "publicKey";
                    },
                    {
                        name: "receiver";
                        type: "publicKey";
                    },
                    {
                        name: "fallbackAddress";
                        type: "publicKey";
                    },
                    {
                        name: "tokenMint";
                        type: "publicKey";
                    },
                    {
                        name: "nativeSender";
                        type: {
                            option: "bytes";
                        };
                    },
                    {
                        name: "sourceChainId";
                        type: {
                            array: ["u8", 32];
                        };
                    },
                    {
                        name: "bump";
                        type: "u8";
                    },
                ];
            };
        },
    ];
    types: [
        {
            name: "TransferredParams";
            docs: ["Send options related to having external call storage in transfer"];
            type: {
                kind: "struct";
                fields: [
                    {
                        name: "fallbackAddress";
                        docs: ["The address to which the tokens will be sent if something goes wrong during the call"];
                        type: "bytes";
                    },
                    {
                        name: "reservedFlag";
                        docs: [
                            "Flags for additional functionality",
                            "See [this trait](crate::submission_id::CheckReservedFlag) for details",
                        ];
                        type: {
                            array: ["u8", 32];
                        };
                    },
                    {
                        name: "externalCallStorageShortcut";
                        docs: [
                            "Hash from external call storage. Using this hash, it is possible to find an external call storage account with data",
                        ];
                        type: {
                            array: ["u8", 32];
                        };
                    },
                ];
            };
        },
        {
            name: "ClaimSubmissionParamsInput";
            type: {
                kind: "struct";
                fields: [
                    {
                        name: "executionFee";
                        type: {
                            array: ["u8", 32];
                        };
                    },
                    {
                        name: "reservedFlag";
                        type: {
                            array: ["u8", 32];
                        };
                    },
                    {
                        name: "nativeSender";
                        type: "bytes";
                    },
                    {
                        name: "externalCallShortcut";
                        type: {
                            option: {
                                array: ["u8", 32];
                            };
                        };
                    },
                ];
            };
        },
        {
            name: "SendSubmissionParamsInput";
            type: {
                kind: "struct";
                fields: [
                    {
                        name: "executionFee";
                        type: "u64";
                    },
                    {
                        name: "reservedFlag";
                        type: {
                            array: ["u8", 32];
                        };
                    },
                    {
                        name: "fallbackAddress";
                        type: "bytes";
                    },
                    {
                        name: "externalCallShortcut";
                        type: {
                            array: ["u8", 32];
                        };
                    },
                ];
            };
        },
        {
            name: "FeeType";
            type: {
                kind: "enum";
                variants: [
                    {
                        name: "Native";
                    },
                    {
                        name: "Asset";
                    },
                ];
            };
        },
        {
            name: "SendType";
            type: {
                kind: "enum";
                variants: [
                    {
                        name: "Staked";
                    },
                    {
                        name: "Burnt";
                    },
                ];
            };
        },
        {
            name: "ClaimType";
            type: {
                kind: "enum";
                variants: [
                    {
                        name: "Mint";
                    },
                    {
                        name: "Release";
                    },
                ];
            };
        },
        {
            name: "ChangeType";
            type: {
                kind: "enum";
                variants: [
                    {
                        name: "NoChange";
                    },
                    {
                        name: "BalanceStaked";
                    },
                    {
                        name: "BalanceReleased";
                    },
                    {
                        name: "FeeStaked";
                    },
                    {
                        name: "FeeReleased";
                    },
                    {
                        name: "NativeFeeStaked";
                    },
                ];
            };
        },
        {
            name: "ExternalCallMetaVariants";
            type: {
                kind: "enum";
                variants: [
                    {
                        name: "Accumulation";
                        fields: [
                            {
                                name: "external_call_len";
                                type: "u64";
                            },
                        ];
                    },
                    {
                        name: "Execution";
                        fields: [
                            {
                                name: "offset";
                                docs: ["Offset to start external call"];
                                type: "u64";
                            },
                            {
                                name: "external_call_len";
                                type: "u64";
                            },
                            {
                                name: "submission_auth_bump";
                                type: "u8";
                            },
                        ];
                    },
                    {
                        name: "Transferred";
                        fields: [
                            {
                                name: "last_transfer_time";
                                type: "i64";
                            },
                        ];
                    },
                    {
                        name: "Executed";
                    },
                    {
                        name: "Failed";
                    },
                ];
            };
        },
    ];
    events: [
        {
            name: "Log";
            fields: [
                {
                    name: "msg";
                    type: "string";
                    index: false;
                },
            ];
        },
        {
            name: "Transferred";
            fields: [
                {
                    name: "sendType";
                    type: {
                        defined: "SendType";
                    };
                    index: false;
                },
                {
                    name: "submissionId";
                    type: {
                        array: ["u8", 32];
                    };
                    index: false;
                },
                {
                    name: "bridgeId";
                    type: {
                        array: ["u8", 32];
                    };
                    index: false;
                },
                {
                    name: "amount";
                    type: "u64";
                    index: false;
                },
                {
                    name: "receiver";
                    type: "bytes";
                    index: false;
                },
                {
                    name: "nonce";
                    type: {
                        array: ["u8", 32];
                    };
                    index: false;
                },
                {
                    name: "targetChainId";
                    type: {
                        array: ["u8", 32];
                    };
                    index: false;
                },
                {
                    name: "feeType";
                    type: {
                        defined: "FeeType";
                    };
                    index: false;
                },
                {
                    name: "collectedFee";
                    type: "u64";
                    index: false;
                },
                {
                    name: "collectedTransferFee";
                    type: "u64";
                    index: false;
                },
                {
                    name: "nativeSender";
                    type: "publicKey";
                    index: false;
                },
                {
                    name: "submissionParams";
                    type: {
                        option: {
                            defined: "TransferredParams";
                        };
                    };
                    index: false;
                },
                {
                    name: "executionFee";
                    type: {
                        option: "u64";
                    };
                    index: false;
                },
                {
                    name: "denominator";
                    type: "u8";
                    index: false;
                },
                {
                    name: "referralCode";
                    type: {
                        option: "u32";
                    };
                    index: false;
                },
            ];
        },
        {
            name: "Bridged";
            fields: [
                {
                    name: "submissionId";
                    type: {
                        array: ["u8", 32];
                    };
                    index: false;
                },
            ];
        },
        {
            name: "BalanceChanged";
            fields: [
                {
                    name: "claimType";
                    type: {
                        defined: "ChangeType";
                    };
                    index: false;
                },
                {
                    name: "balance";
                    type: "u64";
                    index: false;
                },
                {
                    name: "collectedFee";
                    type: "u64";
                    index: false;
                },
                {
                    name: "withdrawnFee";
                    type: "u64";
                    index: false;
                },
                {
                    name: "collectedNativeFee";
                    type: "u64";
                    index: false;
                },
                {
                    name: "totalSupply";
                    type: "u64";
                    index: false;
                },
            ];
        },
        {
            name: "ExternalCallExecuted";
            fields: [
                {
                    name: "submissionId";
                    type: {
                        array: ["u8", 32];
                    };
                    index: false;
                },
                {
                    name: "instructions";
                    type: "u32";
                    index: false;
                },
            ];
        },
        {
            name: "ExternalCallFinished";
            fields: [
                {
                    name: "submissionId";
                    type: {
                        array: ["u8", 32];
                    };
                    index: false;
                },
            ];
        },
        {
            name: "ExternalCallFailed";
            fields: [
                {
                    name: "submissionId";
                    type: {
                        array: ["u8", 32];
                    };
                    index: false;
                },
                {
                    name: "error";
                    type: "string";
                    index: false;
                },
            ];
        },
    ];
    errors: [
        {
            code: 20096;
            name: "AmountTooBig";
        },
        {
            code: 20097;
            name: "BadNonce";
        },
        {
            code: 20098;
            name: "CantCreateNonceMasterAccount";
        },
        {
            code: 20099;
            name: "ChainNotSupported";
        },
        {
            code: 20100;
            name: "ConfirmationStorageNotEmpty";
        },
        {
            code: 20101;
            name: "ExecuteExpensesError";
        },
        {
            code: 20102;
            name: "ExternalCallDataTooBig";
        },
        {
            code: 20103;
            name: "ExternalCallMetaAlreadyInitialized";
        },
        {
            code: 20104;
            name: "ExternalCallMetaNotInitialized";
        },
        {
            code: 20105;
            name: "ExternalCallStorageNotInitialized";
        },
        {
            code: 20106;
            name: "ExternalInstructionCorrupted";
        },
        {
            code: 20107;
            name: "ExternalCallToBig";
        },
        {
            code: 20108;
            name: "FeeTooHigh";
        },
        {
            code: 20109;
            name: "InvalidExecutor";
        },
        {
            code: 20110;
            name: "InvalidClaimToWallet";
        },
        {
            code: 20111;
            name: "InvalidFallbackWallet";
        },
        {
            code: 20112;
            name: "InvalidNonceMasterKey";
        },
        {
            code: 20113;
            name: "InvalidPayerToWallet";
        },
        {
            code: 20114;
            name: "InvalidReceiver";
        },
        {
            code: 20115;
            name: "InvalidRewardBeneficiaryWallet";
        },
        {
            code: 20116;
            name: "InvalidSubmissionId";
        },
        {
            code: 20117;
            name: "InvalidSubmissionWallet";
        },
        {
            code: 20118;
            name: "NotEnoughAmountForReward";
        },
        {
            code: 20119;
            name: "SubmissionCalculationError";
        },
        {
            code: 20120;
            name: "SubmissionConfirmed";
        },
        {
            code: 20121;
            name: "WrongAmount";
        },
        {
            code: 20122;
            name: "WrongBridgeFeeInfo";
        },
        {
            code: 20123;
            name: "WrongChainSupportAccount";
        },
        {
            code: 20124;
            name: "WrongExecutionFee";
        },
        {
            code: 20125;
            name: "WrongExternalCallMeta";
        },
        {
            code: 20126;
            name: "WrongExternalCallStorage";
        },
        {
            code: 20137;
            name: "WrongExternalCallUpdate";
        },
        {
            code: 20127;
            name: "WrongReceiverAddress";
        },
        {
            code: 20128;
            name: "WrongFallbackAddress";
        },
        {
            code: 20129;
            name: "WrongFeeBeneficiaryWallet";
        },
        {
            code: 20130;
            name: "WrongMintAuthority";
        },
        {
            code: 20131;
            name: "WrongNativeSenderLen";
        },
        {
            code: 20132;
            name: "WrongSentEvent";
        },
        {
            code: 20133;
            name: "WrongStakingWallet";
        },
        {
            code: 20134;
            name: "WrongTargetChainId";
        },
        {
            code: 20135;
            name: "WrongTokenMintBridge";
        },
        {
            code: 20136;
            name: "SendHashedDataNeededForShortcut";
        },
        {
            code: 20138;
            name: "SubstitutionError";
        },
        {
            code: 20139;
            name: "MandatoryBlockError";
        },
        {
            code: 20140;
            name: "WrongAccountForExternalCall";
        },
    ];
};

export const IDL: DebridgeProgram = {
    version: "1.0.1",
    name: "debridge_program",
    docs: [
        "The 'debridge_program' is Solana program provider pub API for deBridge Protocol",
        "For security reasons, ownership of the main structures is carried out from this program.",
        "",
        "There are several roles for this module.",
        '- "👤 User" - user of our Protocol',
        '- "👤 Claimer" - claimer which performs actions for the 👤 User',
        '- "👤 Executor" - executor which performs actions for the 👤 User',
        '- "👤 Protocol Authority" - multi-signature account with extra privilege for setup protocol settings',
    ],
    instructions: [
        {
            name: "initNonceMaster",
            accounts: [
                {
                    name: "nonceStorage",
                    isMut: true,
                    isSigner: false,
                    docs: ["The task of this account is to store the Nonce, which is necessary for the uniqueness of each Send"],
                },
                {
                    name: "payer",
                    isMut: true,
                    isSigner: true,
                },
                {
                    name: "systemProgram",
                    isMut: false,
                    isSigner: false,
                },
            ],
            args: [],
        },
        {
            name: "send",
            docs: [
                "Sends user's token to other chain",
                "",
                "The function sends tokens to staking, takes fee, and emits an event for sending tokens",
                "",
                "# Arguments",
                "* `target_chain_id` - target chain id",
                "* `receiver` - user address in target chain for tokens receiving",
                "* `is_use_asset_fee` - determines how the fee will be paid. True: sending tokens, false: Sol",
                "* `amount` - the number of tokens that the user sends",
                "* `submissions_param` - additional data for tokens sending with auto external execution",
                "",
                "# Events",
                "* [`events::Transferred`]",
                "",
                "# Roles",
                '* "👤 User"',
            ],
            accounts: [
                {
                    name: "bridgeCtx",
                    accounts: [
                        {
                            name: "bridge",
                            isMut: true,
                            isSigner: false,
                            docs: [
                                "The account contains all the information about the operation of the bridge",
                                "",
                                "There are the address of the token with which the bridge works,",
                                "the amount of liquidity stored, the collected fee amount and",
                                "the settings for the operation of the bridge",
                            ],
                        },
                        {
                            name: "tokenMint",
                            isMut: true,
                            isSigner: false,
                            docs: ["The mint account of the token with which the bridge works"],
                        },
                        {
                            name: "stakingWallet",
                            isMut: true,
                            isSigner: false,
                            docs: [
                                "The account stores the user's staking tokens and the fee collected by the bridge in tokens",
                                "",
                                "Verification of account takes place in [`Sending::send_token`] and [`Claiming::process_token`]",
                            ],
                        },
                        {
                            name: "mintAuthority",
                            isMut: false,
                            isSigner: false,
                            docs: [
                                "The PDA that is the authorization for the transfer of tokens to the user",
                                "",
                                "It's wrapper token mint authority account for mint bridge,",
                                "staking token account owner for send bridge and changing",
                                "balance in bridge_data",
                            ],
                        },
                        {
                            name: "chainSupportInfo",
                            isMut: false,
                            isSigner: false,
                            docs: ["The account that stores support and fee information for a specific chain"],
                        },
                        {
                            name: "settingsProgram",
                            isMut: false,
                            isSigner: false,
                            docs: ["Debridge settings  program"],
                        },
                        {
                            name: "splTokenProgram",
                            isMut: false,
                            isSigner: false,
                            docs: ["System spl token program"],
                        },
                    ],
                },
                {
                    name: "stateCtx",
                    accounts: [
                        {
                            name: "state",
                            isMut: true,
                            isSigner: false,
                            docs: [
                                "State account with service information",
                                "",
                                "This account from settings program is also a unique state for debridge program.",
                            ],
                        },
                        {
                            name: "feeBeneficiary",
                            isMut: true,
                            isSigner: false,
                            docs: [
                                "Beneficiary of the commission in the system",
                                "",
                                "The unique value of this account is stored in the state account",
                                "Implied that this will be an account belonging to another program (FeeProxy),",
                                "which will be responsible for the distribution of commissions",
                            ],
                        },
                    ],
                },
                {
                    name: "nonceStorage",
                    isMut: true,
                    isSigner: false,
                    docs: ["The task of this account is to store the Nonce, which is necessary for the uniqueness of each Send"],
                },
                {
                    name: "sendFromWallet",
                    isMut: true,
                    isSigner: false,
                    docs: ["👤 User token account from which money is sent"],
                },
                {
                    name: "systemProgram",
                    isMut: false,
                    isSigner: false,
                    docs: ["Solana system program"],
                },
                {
                    name: "externalCallStorage",
                    isMut: true,
                    isSigner: false,
                    docs: [
                        "Storage for external call instructions",
                        "",
                        "The key is checked after calculating the Submission id",
                        "It has [`ExternalCallMeta'] structure and is initialized when `submission_params` is not None.",
                        "If `submission_params` is None this account is ignored",
                    ],
                },
                {
                    name: "externalCallMeta",
                    isMut: true,
                    isSigner: false,
                    docs: [
                        "The account that stores information about external call current state.",
                        "",
                        "It has [`ExternalCallMeta'] structure and is initialized when `submission_params` is not None.",
                        "If `submission_params` is None this account is ignored",
                    ],
                },
                {
                    name: "sendFrom",
                    isMut: true,
                    isSigner: true,
                    docs: ["👤 User Authority"],
                },
                {
                    name: "discount",
                    isMut: false,
                    isSigner: false,
                    docs: ["The account allows the user to get a discount when using the bridge"],
                },
                {
                    name: "bridgeFee",
                    isMut: false,
                    isSigner: false,
                    docs: [
                        "The account determines whether it is possible to take fix fee from sending tokens",
                        "and the percentage of these tokens. Otherwise fix fee in SOL is taken",
                    ],
                },
            ],
            args: [
                {
                    name: "targetChainId",
                    type: {
                        array: ["u8", 32],
                    },
                },
                {
                    name: "receiver",
                    type: "bytes",
                },
                {
                    name: "isUseAssetFee",
                    type: "bool",
                },
                {
                    name: "amount",
                    type: "u64",
                },
                {
                    name: "submissionParams",
                    type: {
                        option: {
                            defined: "SendSubmissionParamsInput",
                        },
                    },
                },
                {
                    name: "referralCode",
                    type: {
                        option: "u32",
                    },
                },
            ],
        },
        {
            name: "claim",
            docs: [
                "Claims user's token from other chain",
                "",
                "The function checks that the submission is valid and sends tokens to the user.",
                "The function can also send tokens through a call proxy to perform additional actions",
                "",
                "# Arguments",
                "* `source_chain_id` - source chain id",
                "* `raw_amount` - the number of tokens that the user claims",
                "* `nonce` - a unique number that makes the submission unique",
                "* `submissions_param` - additional data for tokens claiming with auto external execution",
                "",
                "# Events",
                "* [`events::Bridged`]",
                "",
                "# Roles",
                '* "👤 Claimer"',
            ],
            accounts: [
                {
                    name: "submission",
                    isMut: true,
                    isSigner: false,
                    docs: [
                        "The account determines whether tokens have been claimed based on the received submission",
                        "",
                        "If this account based on the submission ID exists, then the claim was performed earlier",
                        "seeds of this account is `[SUBMISSION_SEED, &submission_id]`. We check them during the creation",
                        "of the `submission`, since at that stage we already have a calculated submission id",
                    ],
                },
                {
                    name: "bridgeCtx",
                    accounts: [
                        {
                            name: "bridge",
                            isMut: true,
                            isSigner: false,
                            docs: [
                                "The account contains all the information about the operation of the bridge",
                                "",
                                "There are the address of the token with which the bridge works,",
                                "the amount of liquidity stored, the collected fee amount and",
                                "the settings for the operation of the bridge",
                            ],
                        },
                        {
                            name: "tokenMint",
                            isMut: true,
                            isSigner: false,
                            docs: ["The mint account of the token with which the bridge works"],
                        },
                        {
                            name: "stakingWallet",
                            isMut: true,
                            isSigner: false,
                            docs: [
                                "The account stores the user's staking tokens and the fee collected by the bridge in tokens",
                                "",
                                "Verification of account takes place in [`Sending::send_token`] and [`Claiming::process_token`]",
                            ],
                        },
                        {
                            name: "mintAuthority",
                            isMut: false,
                            isSigner: false,
                            docs: [
                                "The PDA that is the authorization for the transfer of tokens to the user",
                                "",
                                "It's wrapper token mint authority account for mint bridge,",
                                "staking token account owner for send bridge and changing",
                                "balance in bridge_data",
                            ],
                        },
                        {
                            name: "chainSupportInfo",
                            isMut: false,
                            isSigner: false,
                            docs: ["The account that stores support and fee information for a specific chain"],
                        },
                        {
                            name: "settingsProgram",
                            isMut: false,
                            isSigner: false,
                            docs: ["Debridge settings  program"],
                        },
                        {
                            name: "splTokenProgram",
                            isMut: false,
                            isSigner: false,
                            docs: ["System spl token program"],
                        },
                    ],
                },
                {
                    name: "state",
                    accounts: [
                        {
                            name: "state",
                            isMut: true,
                            isSigner: false,
                            docs: [
                                "State account with service information",
                                "",
                                "This account from settings program is also a unique state for debridge program.",
                            ],
                        },
                        {
                            name: "feeBeneficiary",
                            isMut: true,
                            isSigner: false,
                            docs: [
                                "Beneficiary of the commission in the system",
                                "",
                                "The unique value of this account is stored in the state account",
                                "Implied that this will be an account belonging to another program (FeeProxy),",
                                "which will be responsible for the distribution of commissions",
                            ],
                        },
                    ],
                },
                {
                    name: "claimToWallet",
                    isMut: true,
                    isSigner: false,
                    docs: [
                        "On this account the claimed tokens will be transferred.",
                        "",
                        "If claim with external call this account is associated with submission auth account wallet",
                        "If claim without external call this account is associated with claim_to_wallet account wallet or",
                        "if claim_to is Token account itself this account is same as claim_to",
                    ],
                },
                {
                    name: "claimTo",
                    isMut: false,
                    isSigner: false,
                    docs: ["It's account that marked in Submission structure as receiver"],
                },
                {
                    name: "fallbackAddress",
                    isMut: false,
                    isSigner: false,
                },
                {
                    name: "confirmationStorage",
                    isMut: true,
                    isSigner: false,
                    docs: [
                        "The account that stores information about signatures confirming the existence of a submission",
                        "After use, signatures are removed from the storage",
                    ],
                },
                {
                    name: "confirmationStorageCreator",
                    isMut: true,
                    isSigner: false,
                },
                {
                    name: "payer",
                    isMut: true,
                    isSigner: true,
                    docs: ["👤 Claimer"],
                },
                {
                    name: "payerWallet",
                    isMut: true,
                    isSigner: false,
                    docs: ["The wallet owned by payer account. On this account the executor fee will be transferred"],
                },
                {
                    name: "systemProgram",
                    isMut: false,
                    isSigner: false,
                    docs: ["Solana system program"],
                },
                {
                    name: "externalCallStorage",
                    isMut: true,
                    isSigner: false,
                    docs: [
                        "Storage for external call instructions",
                        "",
                        "The key is checked after calculating the Submission id",
                        "It has [`ExternalCallMeta'] structure and is initialized when `submission_params` is not None.",
                        "If `submission_params` is None this account is ignored",
                    ],
                },
                {
                    name: "externalCallMeta",
                    isMut: true,
                    isSigner: false,
                    docs: [
                        "The account that stores information about external call current state.",
                        "",
                        "It has [`ExternalCallMeta'] structure and is initialized when `submission_params` is not None.",
                        "If `submission_params` is None this account is ignored",
                    ],
                },
                {
                    name: "claimMarker",
                    isMut: false,
                    isSigner: false,
                },
            ],
            args: [
                {
                    name: "sourceChainId",
                    type: {
                        array: ["u8", 32],
                    },
                },
                {
                    name: "rawAmount",
                    type: {
                        array: ["u8", 32],
                    },
                },
                {
                    name: "nonce",
                    type: {
                        array: ["u8", 32],
                    },
                },
                {
                    name: "submissionsParam",
                    type: {
                        option: {
                            defined: "ClaimSubmissionParamsInput",
                        },
                    },
                },
            ],
        },
        {
            name: "withdrawBridgeFee",
            docs: [
                "Withdraws fee from the bridge",
                "",
                "Send all fee that bridge collected to the fee_beneficiar_wallet",
                "we create a temporary storage for verified oracle keys that have already signed the message",
                "",
                "# Roles",
                "👤 Protocol Authority",
            ],
            accounts: [
                {
                    name: "stateCtx",
                    accounts: [
                        {
                            name: "state",
                            isMut: true,
                            isSigner: false,
                            docs: [
                                "State account with service information",
                                "",
                                "This account from settings program is also a unique state for debridge program.",
                            ],
                        },
                        {
                            name: "feeBeneficiary",
                            isMut: true,
                            isSigner: false,
                            docs: [
                                "Beneficiary of the commission in the system",
                                "",
                                "The unique value of this account is stored in the state account",
                                "Implied that this will be an account belonging to another program (FeeProxy),",
                                "which will be responsible for the distribution of commissions",
                            ],
                        },
                    ],
                },
                {
                    name: "tokenMint",
                    isMut: true,
                    isSigner: false,
                    docs: ["The mint account of the token with which the bridge works"],
                },
                {
                    name: "bridgeData",
                    isMut: true,
                    isSigner: false,
                    docs: [
                        "The account contains all the information about the operation of the bridge",
                        "",
                        "There are the address of the token with which the bridge works,",
                        "the amount of liquidity stored, the collected fee amount and",
                        "the settings for the operation of the bridge",
                    ],
                },
                {
                    name: "stakingWallet",
                    isMut: true,
                    isSigner: false,
                    docs: ["The account stores the user's staking tokens and the fee collected by the bridge in tokens"],
                },
                {
                    name: "mintAuthority",
                    isMut: false,
                    isSigner: false,
                    docs: [
                        "The PDA that is the authorization for the transfer of tokens to the user",
                        "",
                        "It's wrapper token mint authority account for mint bridge,",
                        "staking token account owner for send bridge and changing",
                        "balance in bridge_data",
                    ],
                },
                {
                    name: "feeBeneficiarWallet",
                    isMut: true,
                    isSigner: false,
                    docs: ["The token account owned by fee beneficiary. Fee is sent to this wallet"],
                },
                {
                    name: "tokenProgram",
                    isMut: false,
                    isSigner: false,
                    docs: ["System spl token program"],
                },
                {
                    name: "settingsProgram",
                    isMut: false,
                    isSigner: false,
                    docs: ["Debridge settings  program"],
                },
            ],
            args: [],
        },
        {
            name: "initExternalCallStorage",
            docs: [
                "Initializing of external call storage",
                "",
                "Due to restrictions on the size of transactions, each claimer initializes its storage for such data",
                "This information is used in [`claim`] by this claimer. If it was the first and everything went",
                "well (successfully claimed), then this store is locked until it has been execute.",
                "Once locked, any executor can execute it",
                "",
                "After complete execute of the external data - the account can be closed with full rent refund",
                "If your claim was unsuccessful, you can close this account at any time with full rent refund",
                "",
                "# Arguments",
                "* `external_call_len` - service information about [`InitExternalCallStorage::external_call_storage`] pubkey",
                "* `is_claim_storage` - define that it is storage for claim or send functions",
                "* `chain_id` - source chain id if it is claim storage and target chain id if it is send storage",
                "* `storage_key` - for [`send`] this is (shortcut)[SendSubmissionParamsInput::external_call_shortcut]",
                "for [`claim`] this is `submission_id` (for details looks at [`submission`] crate",
                "* `raw_instructions` - part of instructions of external call",
                "",
                "# Roles",
                "👤 Claimer",
            ],
            accounts: [
                {
                    name: "externalCallStorage",
                    isMut: true,
                    isSigner: false,
                    docs: [
                        "Storage for external call instructions",
                        "",
                        "The key is checked after calculating the Submission id",
                        "",
                        "Due to the restrictions on the size of the transaction, we allocate storage for the entire external call in [`claim`] or [`send`] action",
                        "Each storage owner creates his own repository, since validation of this storage is possible only when it is completely full",
                    ],
                },
                {
                    name: "externalCallMeta",
                    isMut: true,
                    isSigner: false,
                    docs: ["The account that stores information about external call current state"],
                },
                {
                    name: "storageOwner",
                    isMut: true,
                    isSigner: true,
                    docs: ["👤 Claimer"],
                },
                {
                    name: "systemProgram",
                    isMut: false,
                    isSigner: false,
                    docs: ["Solana system program"],
                },
            ],
            args: [
                {
                    name: "externalCallLen",
                    type: "u32",
                },
                {
                    name: "chainId",
                    type: {
                        array: ["u8", 32],
                    },
                },
                {
                    name: "storageKey",
                    type: {
                        array: ["u8", 32],
                    },
                },
                {
                    name: "rawInstructions",
                    type: "bytes",
                },
            ],
        },
        {
            name: "updateExternalCallStorage",
            docs: [
                "Add instructions to external call storage",
                "",
                "This method will be used if all external data does not fit into one transaction and after",
                "[`init_external_call_storage` you can use this method for add additional data",
                "",
                "Due to restrictions on the size of transactions, each claimer initializes its storage for such data",
                "This information is used in [`claim`] by this claimer. If it was the first and everything went",
                "well (successfully claimed), then this store is locked until it has been execute.",
                "Once locked, any executor can execute it",
                "",
                "After complete execute of the external data - the account can be closed with full rent refund",
                "If your claim was unsuccessful, you can close this account at any time with full rent refund",
                "",
                "# Arguments",
                "* `chain_id` - chain id. `SOLANA_CHAIN_ID` for `send` & `source_chain_id` for `claim` storage",
                "* `submission_id` - this account is uniquely tied to the submission_id and when claimer try to claim, a check for compliance will be performed",
                "* `external_instructions_offset` - offset to the part of storage where raw instructions will be write",
                "* `raw_instructions` - part of instructions of external call",
                "",
                "# Roles",
                "👤 Claimer",
            ],
            accounts: [
                {
                    name: "externalCallStorage",
                    isMut: true,
                    isSigner: false,
                    docs: [
                        "Storage for external call instructions",
                        "",
                        "The key is checked after calculating the Submission id",
                        "The account that stores information about external call current state.",
                    ],
                },
                {
                    name: "externalCallMeta",
                    isMut: true,
                    isSigner: false,
                },
                {
                    name: "claimer",
                    isMut: true,
                    isSigner: true,
                    docs: ["👤 Executor"],
                },
                {
                    name: "systemProgram",
                    isMut: false,
                    isSigner: false,
                    docs: ["Solana system program"],
                },
            ],
            args: [
                {
                    name: "chainId",
                    type: {
                        array: ["u8", 32],
                    },
                },
                {
                    name: "submissionId",
                    type: {
                        array: ["u8", 32],
                    },
                },
                {
                    name: "externalInstructionsOffset",
                    type: "u64",
                },
                {
                    name: "rawInstructions",
                    type: "bytes",
                },
            ],
        },
        {
            name: "closeExternalCallStorage",
            docs: [
                "Close external call storage account and return rent to claimer",
                "",
                "If this external_data was not used to claim, you can close your storage and completely delete this account.",
                "If the data was used for a [`claim`], then the account will be deleted automatically as soon as the external",
                "data is fully executed",
                "",
                "# Arguments",
                "* `source_chain_id` - source chain id",
                "* `submission_id` - this account is uniquely tied to the submission_id and when claimer try to claim, a check for compliance will be performed",
                "",
                "# Roles",
                "👤 Claimer",
            ],
            accounts: [
                {
                    name: "externalCallStorage",
                    isMut: true,
                    isSigner: false,
                    docs: [
                        "Storage for external call instructions",
                        "",
                        "The key is checked after calculating the Submission id",
                        "The account that stores information about external call current state.",
                    ],
                },
                {
                    name: "externalCallMeta",
                    isMut: true,
                    isSigner: false,
                },
                {
                    name: "claimer",
                    isMut: true,
                    isSigner: true,
                    docs: ["👤 Executor"],
                },
                {
                    name: "systemProgram",
                    isMut: false,
                    isSigner: false,
                    docs: ["Solana system program"],
                },
            ],
            args: [
                {
                    name: "chainId",
                    type: {
                        array: ["u8", 32],
                    },
                },
                {
                    name: "submissionId",
                    type: {
                        array: ["u8", 32],
                    },
                },
            ],
        },
        {
            name: "executeExternalCall",
            docs: [
                "Execute external call data for confirmed submission",
                "",
                "Due to restrictions on the size of transactions, each claimer initializes its storage for such data",
                "This information is used in [`claim`] by this claimer. If it was the first and everything went",
                "well (successfully claimed), then this store is locked until it has been execute.",
                "Once locked, any executor can execute it",
                "",
                "After complete execute of the external data - `external_call_storage` account can be automatically closed with full rent refund",
                "to original claimer",
                "",
                "# Arguments",
                "* `submission_id` - this account is uniquely tied to the submission_id and when claimer try to claim, a check for compliance will be performed",
                "* `count` - the number of instructions that we will execute. Executor must compute the optimal count so as not to",
                "overflow computational resource constraints",
                "* `subsitution_bumps` - TODO",
                "",
                "# Roles",
                "👤 Executor",
            ],
            accounts: [
                {
                    name: "state",
                    isMut: false,
                    isSigner: false,
                    docs: [
                        "State account with service information",
                        "",
                        "This account from settings program is also a unique state for debridge program.",
                    ],
                },
                {
                    name: "externalCallStorage",
                    isMut: true,
                    isSigner: false,
                    docs: [
                        "External call storage",
                        "",
                        "This account stored all external_data for `submission_id` and verified by [`claim`] method",
                    ],
                },
                {
                    name: "externalCallMeta",
                    isMut: true,
                    isSigner: false,
                    docs: ["The account that stores information about external call current state"],
                },
                {
                    name: "bridge",
                    isMut: true,
                    isSigner: false,
                    docs: ["Bridge for this submission", "", "Use here for check wallet"],
                },
                {
                    name: "originalClaimer",
                    isMut: true,
                    isSigner: false,
                    docs: ["Claimer who has successfully call [`claim`].", "Here this account is used to verify `external_call_storage`"],
                },
                {
                    name: "submission",
                    isMut: false,
                    isSigner: false,
                    docs: ["An account proving that the transfer was made and with information", "about `original_claimer` account"],
                },
                {
                    name: "submissionAuth",
                    isMut: true,
                    isSigner: false,
                    docs: ["Submission wallet owner"],
                },
                {
                    name: "submissionWallet",
                    isMut: true,
                    isSigner: false,
                    docs: ["Temporary wallet for storing funds during an external call"],
                },
                {
                    name: "rewardBeneficiaryWallet",
                    isMut: true,
                    isSigner: false,
                    docs: ["The wallet of the executor that will receive the reward"],
                },
                {
                    name: "executor",
                    isMut: false,
                    isSigner: true,
                    docs: ['- "👤 Executor"'],
                },
                {
                    name: "fallbackAddress",
                    isMut: true,
                    isSigner: false,
                },
                {
                    name: "fallbackAddressWallet",
                    isMut: true,
                    isSigner: false,
                    docs: [
                        "In case of unsuccessful execution of one of the instructions for any reason,",
                        "the remaining tokens and the remaining rewards should come to this address",
                        "The wallet of `fallback_address` account",
                    ],
                },
                {
                    name: "tokenMint",
                    isMut: true,
                    isSigner: false,
                    docs: ["The mint account of the token with which the bridge works"],
                },
                {
                    name: "systemProgram",
                    isMut: false,
                    isSigner: false,
                    docs: ["Solana system program"],
                },
                {
                    name: "splTokenProgram",
                    isMut: false,
                    isSigner: false,
                    docs: ["System spl token program"],
                },
            ],
            args: [
                {
                    name: "submissionId",
                    type: {
                        array: ["u8", 32],
                    },
                },
                {
                    name: "count",
                    type: "u8",
                },
                {
                    name: "reversedSubsitutionBumps",
                    type: "bytes",
                },
            ],
        },
        {
            name: "makeFallbackForExternalCall",
            accounts: [
                {
                    name: "state",
                    isMut: false,
                    isSigner: false,
                    docs: [
                        "State account with service information",
                        "",
                        "This account from settings program is also a unique state for debridge program.",
                    ],
                },
                {
                    name: "externalCallStorage",
                    isMut: true,
                    isSigner: false,
                    docs: [
                        "External call storage",
                        "",
                        "This account stored all external_data for `submission_id` and verified by [`claim`] method",
                    ],
                },
                {
                    name: "externalCallMeta",
                    isMut: true,
                    isSigner: false,
                    docs: ["The account that stores information about external call current state"],
                },
                {
                    name: "bridge",
                    isMut: true,
                    isSigner: false,
                    docs: ["Bridge for this submission", "", "Use here for check wallet"],
                },
                {
                    name: "originalClaimer",
                    isMut: true,
                    isSigner: false,
                    docs: ["Claimer who has successfully call [`claim`].", "Here this account is used to verify `external_call_storage`"],
                },
                {
                    name: "submission",
                    isMut: false,
                    isSigner: false,
                    docs: ["An account proving that the transfer was made and with information", "about `original_claimer` account"],
                },
                {
                    name: "submissionAuth",
                    isMut: true,
                    isSigner: false,
                    docs: ["Submission wallet owner"],
                },
                {
                    name: "submissionWallet",
                    isMut: true,
                    isSigner: false,
                    docs: ["Temporary wallet for storing funds during an external call"],
                },
                {
                    name: "rewardBeneficiaryWallet",
                    isMut: true,
                    isSigner: false,
                    docs: ["The wallet of the executor that will receive the reward"],
                },
                {
                    name: "executor",
                    isMut: false,
                    isSigner: true,
                    docs: ['- "👤 Executor"'],
                },
                {
                    name: "fallbackAddress",
                    isMut: true,
                    isSigner: false,
                },
                {
                    name: "fallbackAddressWallet",
                    isMut: true,
                    isSigner: false,
                    docs: [
                        "In case of unsuccessful execution of one of the instructions for any reason,",
                        "the remaining tokens and the remaining rewards should come to this address",
                        "The wallet of `fallback_address` account",
                    ],
                },
                {
                    name: "tokenMint",
                    isMut: true,
                    isSigner: false,
                    docs: ["The mint account of the token with which the bridge works"],
                },
                {
                    name: "systemProgram",
                    isMut: false,
                    isSigner: false,
                    docs: ["Solana system program"],
                },
                {
                    name: "splTokenProgram",
                    isMut: false,
                    isSigner: false,
                    docs: ["System spl token program"],
                },
            ],
            args: [
                {
                    name: "submissionId",
                    type: {
                        array: ["u8", 32],
                    },
                },
                {
                    name: "submissionAuthBump",
                    type: "u8",
                },
            ],
        },
        {
            name: "closeSubmissionAuthWallet",
            accounts: [
                {
                    name: "originalClaimer",
                    isMut: true,
                    isSigner: false,
                    docs: ["Claimer who has successfully call [`claim`].", "Here this account is used to verify `external_call_storage`"],
                },
                {
                    name: "submission",
                    isMut: false,
                    isSigner: false,
                    docs: ["An account proving that the transfer was made and with information", "about `original_claimer` account"],
                },
                {
                    name: "submissionAuth",
                    isMut: true,
                    isSigner: false,
                    docs: ["Submission wallet owner"],
                },
                {
                    name: "submissionAuthLostWallet",
                    isMut: true,
                    isSigner: false,
                    docs: ["Temporary wallet for storing funds in process of execution of external call"],
                },
                {
                    name: "externalCallStorage",
                    isMut: false,
                    isSigner: false,
                    docs: [
                        "External call storage",
                        "",
                        "This account stored all external_data for `submission_id` and verified by [`claim`] method",
                    ],
                },
                {
                    name: "externalCallMeta",
                    isMut: true,
                    isSigner: false,
                    docs: ["The account that stores information about external call current state"],
                },
                {
                    name: "fallbackAddressWallet",
                    isMut: true,
                    isSigner: false,
                    docs: [
                        "In case of unsuccessful execution of one of the instructions for any reason,",
                        "the remaining tokens and the remaining rewards should come to this address",
                        "The wallet of `fallback_address` account",
                    ],
                },
                {
                    name: "tokenMint",
                    isMut: false,
                    isSigner: false,
                },
                {
                    name: "splTokenProgram",
                    isMut: false,
                    isSigner: false,
                    docs: ["System spl token program"],
                },
            ],
            args: [
                {
                    name: "submissionId",
                    type: {
                        array: ["u8", 32],
                    },
                },
                {
                    name: "submissionAuthBump",
                    type: "u8",
                },
            ],
        },
    ],
    accounts: [
        {
            name: "claimMarker",
            type: {
                kind: "struct",
                fields: [],
            },
        },
        {
            name: "externalCallMeta",
            type: {
                kind: "struct",
                fields: [
                    {
                        name: "data",
                        type: {
                            defined: "ExternalCallMetaVariants",
                        },
                    },
                    {
                        name: "externalCallStorageBump",
                        type: "u8",
                    },
                    {
                        name: "bump",
                        type: "u8",
                    },
                ],
            },
        },
        {
            name: "externalCallStorage",
            type: {
                kind: "struct",
                fields: [],
            },
        },
        {
            name: "nonceMaster",
            type: {
                kind: "struct",
                fields: [
                    {
                        name: "nonce",
                        type: "u64",
                    },
                ],
            },
        },
        {
            name: "submissionAccount",
            docs: [
                "The existence of this account proves the fact that the transfer",
                "was made and it is confirmed on the network",
                "",
                "It stores the claimer for validation when executing external data",
            ],
            type: {
                kind: "struct",
                fields: [
                    {
                        name: "claimer",
                        type: "publicKey",
                    },
                    {
                        name: "receiver",
                        type: "publicKey",
                    },
                    {
                        name: "fallbackAddress",
                        type: "publicKey",
                    },
                    {
                        name: "tokenMint",
                        type: "publicKey",
                    },
                    {
                        name: "nativeSender",
                        type: {
                            option: "bytes",
                        },
                    },
                    {
                        name: "sourceChainId",
                        type: {
                            array: ["u8", 32],
                        },
                    },
                    {
                        name: "bump",
                        type: "u8",
                    },
                ],
            },
        },
    ],
    types: [
        {
            name: "TransferredParams",
            docs: ["Send options related to having external call storage in transfer"],
            type: {
                kind: "struct",
                fields: [
                    {
                        name: "fallbackAddress",
                        docs: ["The address to which the tokens will be sent if something goes wrong during the call"],
                        type: "bytes",
                    },
                    {
                        name: "reservedFlag",
                        docs: [
                            "Flags for additional functionality",
                            "See [this trait](crate::submission_id::CheckReservedFlag) for details",
                        ],
                        type: {
                            array: ["u8", 32],
                        },
                    },
                    {
                        name: "externalCallStorageShortcut",
                        docs: [
                            "Hash from external call storage. Using this hash, it is possible to find an external call storage account with data",
                        ],
                        type: {
                            array: ["u8", 32],
                        },
                    },
                ],
            },
        },
        {
            name: "ClaimSubmissionParamsInput",
            type: {
                kind: "struct",
                fields: [
                    {
                        name: "executionFee",
                        type: {
                            array: ["u8", 32],
                        },
                    },
                    {
                        name: "reservedFlag",
                        type: {
                            array: ["u8", 32],
                        },
                    },
                    {
                        name: "nativeSender",
                        type: "bytes",
                    },
                    {
                        name: "externalCallShortcut",
                        type: {
                            option: {
                                array: ["u8", 32],
                            },
                        },
                    },
                ],
            },
        },
        {
            name: "SendSubmissionParamsInput",
            type: {
                kind: "struct",
                fields: [
                    {
                        name: "executionFee",
                        type: "u64",
                    },
                    {
                        name: "reservedFlag",
                        type: {
                            array: ["u8", 32],
                        },
                    },
                    {
                        name: "fallbackAddress",
                        type: "bytes",
                    },
                    {
                        name: "externalCallShortcut",
                        type: {
                            array: ["u8", 32],
                        },
                    },
                ],
            },
        },
        {
            name: "FeeType",
            type: {
                kind: "enum",
                variants: [
                    {
                        name: "Native",
                    },
                    {
                        name: "Asset",
                    },
                ],
            },
        },
        {
            name: "SendType",
            type: {
                kind: "enum",
                variants: [
                    {
                        name: "Staked",
                    },
                    {
                        name: "Burnt",
                    },
                ],
            },
        },
        {
            name: "ClaimType",
            type: {
                kind: "enum",
                variants: [
                    {
                        name: "Mint",
                    },
                    {
                        name: "Release",
                    },
                ],
            },
        },
        {
            name: "ChangeType",
            type: {
                kind: "enum",
                variants: [
                    {
                        name: "NoChange",
                    },
                    {
                        name: "BalanceStaked",
                    },
                    {
                        name: "BalanceReleased",
                    },
                    {
                        name: "FeeStaked",
                    },
                    {
                        name: "FeeReleased",
                    },
                    {
                        name: "NativeFeeStaked",
                    },
                ],
            },
        },
        {
            name: "ExternalCallMetaVariants",
            type: {
                kind: "enum",
                variants: [
                    {
                        name: "Accumulation",
                        fields: [
                            {
                                name: "external_call_len",
                                type: "u64",
                            },
                        ],
                    },
                    {
                        name: "Execution",
                        fields: [
                            {
                                name: "offset",
                                docs: ["Offset to start external call"],
                                type: "u64",
                            },
                            {
                                name: "external_call_len",
                                type: "u64",
                            },
                            {
                                name: "submission_auth_bump",
                                type: "u8",
                            },
                        ],
                    },
                    {
                        name: "Transferred",
                        fields: [
                            {
                                name: "last_transfer_time",
                                type: "i64",
                            },
                        ],
                    },
                    {
                        name: "Executed",
                    },
                    {
                        name: "Failed",
                    },
                ],
            },
        },
    ],
    events: [
        {
            name: "Log",
            fields: [
                {
                    name: "msg",
                    type: "string",
                    index: false,
                },
            ],
        },
        {
            name: "Transferred",
            fields: [
                {
                    name: "sendType",
                    type: {
                        defined: "SendType",
                    },
                    index: false,
                },
                {
                    name: "submissionId",
                    type: {
                        array: ["u8", 32],
                    },
                    index: false,
                },
                {
                    name: "bridgeId",
                    type: {
                        array: ["u8", 32],
                    },
                    index: false,
                },
                {
                    name: "amount",
                    type: "u64",
                    index: false,
                },
                {
                    name: "receiver",
                    type: "bytes",
                    index: false,
                },
                {
                    name: "nonce",
                    type: {
                        array: ["u8", 32],
                    },
                    index: false,
                },
                {
                    name: "targetChainId",
                    type: {
                        array: ["u8", 32],
                    },
                    index: false,
                },
                {
                    name: "feeType",
                    type: {
                        defined: "FeeType",
                    },
                    index: false,
                },
                {
                    name: "collectedFee",
                    type: "u64",
                    index: false,
                },
                {
                    name: "collectedTransferFee",
                    type: "u64",
                    index: false,
                },
                {
                    name: "nativeSender",
                    type: "publicKey",
                    index: false,
                },
                {
                    name: "submissionParams",
                    type: {
                        option: {
                            defined: "TransferredParams",
                        },
                    },
                    index: false,
                },
                {
                    name: "executionFee",
                    type: {
                        option: "u64",
                    },
                    index: false,
                },
                {
                    name: "denominator",
                    type: "u8",
                    index: false,
                },
                {
                    name: "referralCode",
                    type: {
                        option: "u32",
                    },
                    index: false,
                },
            ],
        },
        {
            name: "Bridged",
            fields: [
                {
                    name: "submissionId",
                    type: {
                        array: ["u8", 32],
                    },
                    index: false,
                },
            ],
        },
        {
            name: "BalanceChanged",
            fields: [
                {
                    name: "claimType",
                    type: {
                        defined: "ChangeType",
                    },
                    index: false,
                },
                {
                    name: "balance",
                    type: "u64",
                    index: false,
                },
                {
                    name: "collectedFee",
                    type: "u64",
                    index: false,
                },
                {
                    name: "withdrawnFee",
                    type: "u64",
                    index: false,
                },
                {
                    name: "collectedNativeFee",
                    type: "u64",
                    index: false,
                },
                {
                    name: "totalSupply",
                    type: "u64",
                    index: false,
                },
            ],
        },
        {
            name: "ExternalCallExecuted",
            fields: [
                {
                    name: "submissionId",
                    type: {
                        array: ["u8", 32],
                    },
                    index: false,
                },
                {
                    name: "instructions",
                    type: "u32",
                    index: false,
                },
            ],
        },
        {
            name: "ExternalCallFinished",
            fields: [
                {
                    name: "submissionId",
                    type: {
                        array: ["u8", 32],
                    },
                    index: false,
                },
            ],
        },
        {
            name: "ExternalCallFailed",
            fields: [
                {
                    name: "submissionId",
                    type: {
                        array: ["u8", 32],
                    },
                    index: false,
                },
                {
                    name: "error",
                    type: "string",
                    index: false,
                },
            ],
        },
    ],
    errors: [
        {
            code: 20096,
            name: "AmountTooBig",
        },
        {
            code: 20097,
            name: "BadNonce",
        },
        {
            code: 20098,
            name: "CantCreateNonceMasterAccount",
        },
        {
            code: 20099,
            name: "ChainNotSupported",
        },
        {
            code: 20100,
            name: "ConfirmationStorageNotEmpty",
        },
        {
            code: 20101,
            name: "ExecuteExpensesError",
        },
        {
            code: 20102,
            name: "ExternalCallDataTooBig",
        },
        {
            code: 20103,
            name: "ExternalCallMetaAlreadyInitialized",
        },
        {
            code: 20104,
            name: "ExternalCallMetaNotInitialized",
        },
        {
            code: 20105,
            name: "ExternalCallStorageNotInitialized",
        },
        {
            code: 20106,
            name: "ExternalInstructionCorrupted",
        },
        {
            code: 20107,
            name: "ExternalCallToBig",
        },
        {
            code: 20108,
            name: "FeeTooHigh",
        },
        {
            code: 20109,
            name: "InvalidExecutor",
        },
        {
            code: 20110,
            name: "InvalidClaimToWallet",
        },
        {
            code: 20111,
            name: "InvalidFallbackWallet",
        },
        {
            code: 20112,
            name: "InvalidNonceMasterKey",
        },
        {
            code: 20113,
            name: "InvalidPayerToWallet",
        },
        {
            code: 20114,
            name: "InvalidReceiver",
        },
        {
            code: 20115,
            name: "InvalidRewardBeneficiaryWallet",
        },
        {
            code: 20116,
            name: "InvalidSubmissionId",
        },
        {
            code: 20117,
            name: "InvalidSubmissionWallet",
        },
        {
            code: 20118,
            name: "NotEnoughAmountForReward",
        },
        {
            code: 20119,
            name: "SubmissionCalculationError",
        },
        {
            code: 20120,
            name: "SubmissionConfirmed",
        },
        {
            code: 20121,
            name: "WrongAmount",
        },
        {
            code: 20122,
            name: "WrongBridgeFeeInfo",
        },
        {
            code: 20123,
            name: "WrongChainSupportAccount",
        },
        {
            code: 20124,
            name: "WrongExecutionFee",
        },
        {
            code: 20125,
            name: "WrongExternalCallMeta",
        },
        {
            code: 20126,
            name: "WrongExternalCallStorage",
        },
        {
            code: 20137,
            name: "WrongExternalCallUpdate",
        },
        {
            code: 20127,
            name: "WrongReceiverAddress",
        },
        {
            code: 20128,
            name: "WrongFallbackAddress",
        },
        {
            code: 20129,
            name: "WrongFeeBeneficiaryWallet",
        },
        {
            code: 20130,
            name: "WrongMintAuthority",
        },
        {
            code: 20131,
            name: "WrongNativeSenderLen",
        },
        {
            code: 20132,
            name: "WrongSentEvent",
        },
        {
            code: 20133,
            name: "WrongStakingWallet",
        },
        {
            code: 20134,
            name: "WrongTargetChainId",
        },
        {
            code: 20135,
            name: "WrongTokenMintBridge",
        },
        {
            code: 20136,
            name: "SendHashedDataNeededForShortcut",
        },
        {
            code: 20138,
            name: "SubstitutionError",
        },
        {
            code: 20139,
            name: "MandatoryBlockError",
        },
        {
            code: 20140,
            name: "WrongAccountForExternalCall",
        },
    ],
};
