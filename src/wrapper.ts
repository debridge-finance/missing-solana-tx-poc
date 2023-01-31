export type DebridgeInvokeExample = {
  version: "0.0.0";
  name: "debridge_invoke_example";
  instructions: [
    {
      name: "sendViaDebridge";
      docs: [
        "Debridge protocol allow transfer liqudity from Solana to other supported chains",
        "To send some token to other supported chain use [`debridge_sdk::sending::invoke_debridge_send`]",
        "",
        "To check if the network is supported use [`debridge_sdk::sending::is_chain_supported`]",
      ];
      accounts: [];
      args: [
        {
          name: "amount";
          type: "u64";
        },
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
      ];
    },
    {
      name: "sendViaDebridgeWithNativeFixedFee";
      docs: [
        "Debridge protocol take fix fee and transfer fee while sending liqudity.",
        "The fix fee by default is taken in native solana tokens.",
        "The default native fix fee amount is setted in state account but it can setted custom native",
        "fix amount for a specific chain in chain support info account.",
        "",
        "To get default native fix fee amount use [`debridge_sdk::sending::get_default_native_fix_fee`]",
        "",
        "To get native fix fee amount for specific chain use [`debridge_sdk::sending::get_chain_native_fix_fee`]",
        "",
        "To use native fix fee set [`debridge_sdk::sending::SendIx`] `is_use_asset_fee` field to `false`",
      ];
      accounts: [];
      args: [
        {
          name: "amount";
          type: "u64";
        },
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
      ];
    },
    {
      name: "sendViaDebridgeWithAssetFixedFee";
      docs: [
        "Debridge protocol take fix fee and transfer fee while sending liqudity.",
        "The fix fee by default is taken in native solana tokens.",
        "But when transferring some tokens to certain networks, it is possible to pay in transferred tokens.",
        "It's called `asset_fix_fee`.",
        "",
        "To known `asset_fee` is avaliable use [`debridge_sdk::sending::is_asset_fee_avaliable`]",
        "",
        "To get asset fix fee amount for specific chain use [`debridge_sdk::sending::try_get_chain_asset_fix_fee`]",
        "",
        "To use asset fix fee set [`debridge_sdk::sending::SendIx`] `is_use_asset_fee` field to `true`",
      ];
      accounts: [];
      args: [
        {
          name: "amount";
          type: "u64";
        },
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
      ];
    },
    {
      name: "checkClaiming";
      accounts: [
        {
          name: "submission";
          isMut: false;
          isSigner: false;
        },
        {
          name: "submissionAuthority";
          isMut: false;
          isSigner: false;
        },
        {
          name: "instructions";
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
          name: "nativeSender";
          type: {
            option: "bytes";
          };
        },
      ];
    },
  ];
  errors: [
    {
      code: 6000;
      name: "ChainNotSupported";
    },
    {
      code: 6001;
      name: "ChainSupportInfoDeserializingFailed";
    },
  ];
};

export const IDL: DebridgeInvokeExample = {
  version: "0.0.0",
  name: "debridge_invoke_example",
  instructions: [
    {
      name: "sendViaDebridge",
      docs: [
        "Debridge protocol allow transfer liqudity from Solana to other supported chains",
        "To send some token to other supported chain use [`debridge_sdk::sending::invoke_debridge_send`]",
        "",
        "To check if the network is supported use [`debridge_sdk::sending::is_chain_supported`]",
      ],
      accounts: [],
      args: [
        {
          name: "amount",
          type: "u64",
        },
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
      ],
    },
    {
      name: "sendViaDebridgeWithNativeFixedFee",
      docs: [
        "Debridge protocol take fix fee and transfer fee while sending liqudity.",
        "The fix fee by default is taken in native solana tokens.",
        "The default native fix fee amount is setted in state account but it can setted custom native",
        "fix amount for a specific chain in chain support info account.",
        "",
        "To get default native fix fee amount use [`debridge_sdk::sending::get_default_native_fix_fee`]",
        "",
        "To get native fix fee amount for specific chain use [`debridge_sdk::sending::get_chain_native_fix_fee`]",
        "",
        "To use native fix fee set [`debridge_sdk::sending::SendIx`] `is_use_asset_fee` field to `false`",
      ],
      accounts: [],
      args: [
        {
          name: "amount",
          type: "u64",
        },
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
      ],
    },
    {
      name: "sendViaDebridgeWithAssetFixedFee",
      docs: [
        "Debridge protocol take fix fee and transfer fee while sending liqudity.",
        "The fix fee by default is taken in native solana tokens.",
        "But when transferring some tokens to certain networks, it is possible to pay in transferred tokens.",
        "It's called `asset_fix_fee`.",
        "",
        "To known `asset_fee` is avaliable use [`debridge_sdk::sending::is_asset_fee_avaliable`]",
        "",
        "To get asset fix fee amount for specific chain use [`debridge_sdk::sending::try_get_chain_asset_fix_fee`]",
        "",
        "To use asset fix fee set [`debridge_sdk::sending::SendIx`] `is_use_asset_fee` field to `true`",
      ],
      accounts: [],
      args: [
        {
          name: "amount",
          type: "u64",
        },
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
      ],
    },
    {
      name: "checkClaiming",
      accounts: [
        {
          name: "submission",
          isMut: false,
          isSigner: false,
        },
        {
          name: "submissionAuthority",
          isMut: false,
          isSigner: false,
        },
        {
          name: "instructions",
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
          name: "nativeSender",
          type: {
            option: "bytes",
          },
        },
      ],
    },
  ],
  errors: [
    {
      code: 6000,
      name: "ChainNotSupported",
    },
    {
      code: 6001,
      name: "ChainSupportInfoDeserializingFailed",
    },
  ],
};
