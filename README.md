# unchain-base-mini-app

BaseのMiniAppKitを使ってシューティングゲームアプリを作るリポジトリ

## シューティングゲームのデモ

[デモ動画](https://x.com/haruki_web3/status/1962851527074472211)

## テンプレプロジェクト生成コマンド

```bash
npx create-onchain@latest --mini
```

## 事前セットアップ

- 環境変数用のファイル生成

  ```bash
  cp .env.example .env
  ```

- 環境変数のセットアップ

  farcaster上にmini appとしてデプロイするために以下の5つの値を埋める必要がある

  ```txt
  NEXT_PUBLIC_URL=
  NEXT_PUBLIC_ONCHAINKIT_API_KEY=
  FARCASTER_HEADER=
  FARCASTER_PAYLOAD=
  FARCASTER_SIGNATURE=
  ```

  - `NEXT_PUBLIC_URL`について

    Vercelにアプリをデプロイした後にURLをそのまま貼り付ければOK!

  - `NEXT_PUBLIC_ONCHAINKIT_API_KEY`について

    Coinbase Developer PlaformにログインしてAPIキーを発行しその値を貼り付ければOK!

  - 残りの3つの値について

    FarcasterのWebサイトにログインし、setting⇨からvercelにデプロイしたURLを入力して検証し、表示された値を環境変数として貼り付ける

    ```txt
    FARCASTER_HEADER=
    FARCASTER_PAYLOAD=
    FARCASTER_SIGNATURE=
    ``` 

  - スマートコントラクトのデプロイ

    Remix IDEで以下のコードをコピー＆ペーストしてチェーンをBase Sepoliaに指定してデプロイする。

    ```ts
    // SPDX-License-Identifier: MIT
    // Compatible with OpenZeppelin Contracts ^5.4.0
    pragma solidity ^0.8.27;

    import {ERC1155} from "@openzeppelin/contracts/token/ERC1155/ERC1155.sol";
    import {ERC1155Burnable} from "@openzeppelin/contracts/token/ERC1155/extensions/ERC1155Burnable.sol";
    import {ERC1155Supply} from "@openzeppelin/contracts/token/ERC1155/extensions/ERC1155Supply.sol";
    import {Ownable} from "@openzeppelin/contracts/access/Ownable.sol";

    /**
     * シューティングゲームNFT
    * 倒した敵の数だけERC1155のNFTがミントされる
    */
    contract ShootingGameNFT is ERC1155, Ownable, ERC1155Burnable, ERC1155Supply {
        constructor(address initialOwner) ERC1155("") Ownable(initialOwner) {}

        function setURI(string memory newuri) public onlyOwner {
            _setURI(newuri);
        }

        function mint(address account, uint256 id, uint256 amount, bytes memory data)
            public
        {
            _mint(account, id, amount, data);
        }

        function mintBatch(address to, uint256[] memory ids, uint256[] memory amounts, bytes memory data)
            public
            onlyOwner
        {
            _mintBatch(to, ids, amounts, data);
        }

        // The following functions are overrides required by Solidity.

        function _update(address from, address to, uint256[] memory ids, uint256[] memory values)
            internal
            override(ERC1155, ERC1155Supply)
        {
            super._update(from, to, ids, values);
        }
    }
    ```

    デプロイしたコントラクトのアドレスは`utils/constants.ts`の以下の値に設定する

    ```ts
    // base sepoliaにデプロイしたシューティングゲームNFT
    export const NFT_ADDRESS = <ここにデプロイしたコントラクトのアドレスを貼り付ける>;
    ```

## ビルド＆ローカルでの起動

- ビルド

  ```bash
  pnpm run build
  ```

- ローカルで起動

  ```bash
  pnpm run dev
  ```

## vercelにデプロイする

- プレビュー

  ```bash
  vercel
  ```

- リリース

  ```bash
  vercel --prod
  ```