import api from "../api";

export interface Ativo {
  codBem: string;
  descricao: string;
  modeloProd: string;
  fabricaProd: string;
  dataAquisicao: string;
  endereco: string;
  local: string;
  valorCompra: string;
  valorResidual: string;
  grupo: string;
}

export interface ItemsConferidos {
  id: string;
  codBem: string;
  localVerificado: string;
  pertence: boolean;
  localReal: any;
  usuarioId: string;
  conferenciaId: string;
  ativo: Ativo;
}

export interface getConferenciaProps {
  id: string;
  titulo: string;
  ambiente: string;
  endereco: string;
  descricao: string;
  status: string;
  dataCriacao: string;
  dataFinalizacao: any;
  criadorId: string;
  itensConferidos: ItemsConferidos[];
  participantes: any[];
}

export async function buscaConferencias(
  id: string
): Promise<getConferenciaProps[]> {
  const response = await api.get<getConferenciaProps[]>(
    `/conferencias/historico/${id}`
  );

  return response.data;
}
