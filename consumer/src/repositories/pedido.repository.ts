import { pool } from '../infra/database';

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

export default class PedidoRepository {
  public async findAllByOrder(order: string) {
    const result = await pool.query(
      `SELECT p.id, p.numero, p.cnpj, p.status, p.created_at,
              json_agg(json_build_object('nome', i.nome, 'qtd', i.qtd)) AS items
       FROM pedidos p
       LEFT JOIN pedido_items i ON i.pedido_id = p.id
       WHERE p.numero = $1
       GROUP BY p.id`,
      [order]
    );
    return result.rows;
  }

  public async findOne(filter: { numero: number; cnpj: string }) {
    const result = await pool.query(
      `SELECT p.id, p.numero, p.cnpj, p.status, p.created_at,
              json_agg(json_build_object('nome', i.nome, 'qtd', i.qtd)) AS items
       FROM pedidos p
       LEFT JOIN pedido_items i ON i.pedido_id = p.id
       WHERE p.numero = $1 AND p.cnpj = $2
       GROUP BY p.id`,
      [filter.numero, filter.cnpj]
    );
    return result.rows[0];
  }

  public async create(payload: PedidoPayload) {
    const client = await pool.connect();
    try {
      await client.query('BEGIN');
      const pedidoResult = await client.query(
        `INSERT INTO pedidos (numero, cnpj, status)
         VALUES ($1, $2, $3) RETURNING id`,
        [payload.numero, payload.cnpj, payload.status ?? true]
      );
      const pedidoId = pedidoResult.rows[0].id;

      for (const item of payload.items) {
        await client.query(
          `INSERT INTO pedido_items (pedido_id, nome, qtd)
           VALUES ($1, $2, $3)`,
          [pedidoId, item.nome, item.qtd]
        );
      }

      await client.query('COMMIT');
      return pedidoId;
    } catch (err) {
      await client.query('ROLLBACK');
      throw err;
    } finally {
      client.release();
    }
  }

  public async update(id: number, payload: PedidoPayload) {
    const client = await pool.connect();
    try {
      await client.query('BEGIN');

      await client.query(
        `UPDATE pedidos SET status = $1, updated_at = NOW() WHERE id = $2`,
        [payload.status ?? true, id]
      );

      await client.query(`DELETE FROM pedido_items WHERE pedido_id = $1`, [id]);

      for (const item of payload.items) {
        await client.query(
          `INSERT INTO pedido_items (pedido_id, nome, qtd)
           VALUES ($1, $2, $3)`,
          [id, item.nome, item.qtd]
        );
      }

      await client.query('COMMIT');
      return id;
    } catch (err) {
      await client.query('ROLLBACK');
      throw err;
    } finally {
      client.release();
    }
  }
}
