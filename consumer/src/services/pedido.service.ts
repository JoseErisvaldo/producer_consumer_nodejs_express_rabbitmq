import PedidoRepository from "../repositories/pedido.repository";

interface Item {
  nome: string;
  qtd: number;
}

interface PedidoPayload {
  numero: number;
  cnpj: string;
  status?: boolean;
  items: Item[];
}

export default class PedidoService {
  constructor(private readonly repo: PedidoRepository) {}

  public async findAllByOrder(order: string): Promise<any> {
    const result = await this.repo.findAllByOrder(order);
    return result.length === 0 ? { message: 'Pedidos não encontrados' } : result;
  }

  public async handleMessage(payload: PedidoPayload): Promise<any> {
    const { numero, cnpj } = payload;
    const found = await this.repo.findOne({ numero, cnpj });

    if (found) {
      return await this.update(found, payload);
    }

    return await this.repo.create(payload);
  }

  public async update(found: any, payload: PedidoPayload): Promise<any> {
    return await this.repo.update(found.id, payload);
  }
}
