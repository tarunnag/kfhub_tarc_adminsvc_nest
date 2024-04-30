import { KfConfigCli } from '@kf-products-core/kfhub_svc_lib';
new KfConfigCli()
    .main(process.argv)
    .then(() => process.exit(0))
    .catch(() => process.exit(1));
