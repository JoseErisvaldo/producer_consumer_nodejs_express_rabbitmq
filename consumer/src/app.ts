import { rabbitmqFactory } from './factories/pedido.factory';
import { connect } from './infra/database';
import SetupServer from './server';


(async (): Promise<void> => {
  await connect();

  const PORT = process.env.PORT || '3333';
  new SetupServer(parseInt(PORT)).init();

  await rabbitmqFactory();
})();

console.log('POSTGRES_URL ->', process.env.POSTGRES_URL);
