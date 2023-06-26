# Safe{DAO} Governance

The portal to Safe{DAO} governance, voting power delegation and allocation claiming.

## Environments

The app deploys to the following environments:

- When a PR is opened: https://<<PR_NAME>>--governance.review-react-br.5afe.dev
- When code is merged into `dev`: https://safe-dao-governance.dev.5afe.dev/
- When code is merged into `main`: https://safe-dao-governance.staging.5afe.dev
- When code is released: https://governance.safe.global

## Getting started with local development

### Environment variables

Create a `.env` file with environment variables. You can use the `.env.example` file as a reference.

Here's the list of all the required and optional variables:

| Env variable                |              | Description                                                                                                         |
| --------------------------- | ------------ | ------------------------------------------------------------------------------------------------------------------- |
| `NEXT_PUBLIC_INFURA_TOKEN`  | **required** | [Infura](https://docs.infura.io/infura/networks/ethereum/how-to/secure-a-project/project-id) RPC API token          |
| `NEXT_PUBLIC_IS_PRODUCTION` | optional     | Set to `true` to build a minified production app                                                                    |
| `NEXT_PUBLIC_WC_BRIDGE`     | optional     | [WalletConnect v1](https://docs.walletconnect.com/1.0/bridge-server) bridge URL, falls back to the public WC bridge |
| `NEXT_PUBLIC_WC_PROJECT_ID` | optional     | [WalletConnect v2](https://docs.walletconnect.com/2.0/cloud/relay) project ID                                       |

If you don't provide some of the optional vars, the corresponding features may not work as intended.

### Running the app locally

Install the dependencies:

```bash
yarn
```

Run the development server:

```bash
yarn start
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the app.
