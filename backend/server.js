require("dotenv").config({ path: require("path").resolve(__dirname, ".env") });

const express = require("express");
const cors = require("cors");
const OpenAI = require("openai");

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

let openai = null;

function getOpenAIClient() {
  if (!process.env.OPENAI_API_KEY) {
    throw new Error("OPENAI_API_KEY nao configurada no arquivo backend/.env.");
  }

  if (!openai) {
    openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY
    });
  }

  return openai;
}

function gerarFallbackEmergencia(descricao) {
  const texto = (descricao || "").toLowerCase();
  const sinais = [];
  const fazer = [];
  const evitar = [];
  const emergencia = [];

  if (texto.includes("autista") || texto.includes("autismo")) {
    sinais.push("Pessoa com sensibilidade sensorial ou dificuldade de comunicacao em situacao de estresse.");
    fazer.push("Fale com voz calma, use frases curtas e reduza estimulos como barulho, toque e luz forte.");
    evitar.push("Evite gritar, tocar sem avisar ou insistir em contato visual.");
  }

  if (texto.includes("ansiedade") || texto.includes("crise")) {
    sinais.push("Possivel crise de ansiedade ou desorganizacao emocional.");
    fazer.push("Leve a pessoa para um local mais silencioso e oriente a respirar de forma lenta.");
    evitar.push("Evite cercar a pessoa com muitas perguntas ao mesmo tempo.");
  }

  if (texto.includes("alerg")) {
    sinais.push("Historico de alergia informado.");
    fazer.push("Verifique exposicao recente a alimento, medicamento ou substancia alergica.");
    emergencia.push("Chame emergencia imediatamente se houver falta de ar, inchaco no rosto ou queda de pressao.");
  }

  if (texto.includes("medic")) {
    fazer.push("Confirme os medicamentos em uso antes de qualquer administracao adicional.");
    evitar.push("Evite medicar por conta propria sem confirmar alergias e uso atual.");
  }

  if (sinais.length === 0) {
    sinais.push("Paciente com informacoes cadastradas para apoio rapido em situacao de atendimento.");
  }

  if (fazer.length === 0) {
    fazer.push("Leia os dados do QR com calma, priorize seguranca, ventilacao adequada e contato com familiar ou responsavel.");
  }

  if (evitar.length === 0) {
    evitar.push("Evite movimentos bruscos, excesso de pessoas ao redor e intervencoes sem confirmar o historico informado.");
  }

  if (emergencia.length === 0) {
    emergencia.push("Acione emergencia se houver perda de consciencia, falta de ar, convulsao, dor intensa ou piora rapida do quadro.");
  }

  return [
    "Situacao do paciente:",
    ...sinais.map((item) => `- ${item}`),
    "",
    "O que fazer:",
    ...fazer.map((item) => `- ${item}`),
    "",
    "O que evitar:",
    ...evitar.map((item) => `- ${item}`),
    "",
    "Quando chamar emergencia:",
    ...emergencia.map((item) => `- ${item}`)
  ].join("\n");
}

app.get("/teste", (req, res) => {
  res.json({ ok: true });
});

app.post("/ia", async (req, res) => {
  try {
    const { descricao } = req.body;

    if (!descricao || !descricao.trim()) {
      return res.status(400).json({ erro: "Descricao nao enviada." });
    }

    const client = getOpenAIClient();
    const resposta = await client.responses.create({
      model: "gpt-4.1-mini",
      instructions: [
        "Voce e um assistente medico de emergencia.",
        "Analise os dados do paciente e gere instrucoes claras para socorro.",
        "Seja direto e objetivo.",
        "Use topicos curtos.",
        "Evite respostas genericas.",
        "De instrucoes praticas e especificas.",
        "Considere condicoes como autismo, ansiedade, alergias e outras doencas.",
        "Priorize sempre a seguranca do paciente.",
        "Estruture em: Situacao do paciente, O que fazer, O que evitar, Quando chamar emergencia."
      ].join(" "),
      input: descricao
    });

    const texto = (resposta.output_text || "").trim();

    if (!texto) {
      throw new Error("A OpenAI retornou uma resposta vazia.");
    }

    res.json({ texto });
  } catch (err) {
    console.error("Erro ao gerar resposta da IA:", err);

    if (err?.status === 429) {
      const textoFallback = gerarFallbackEmergencia(req.body?.descricao);

      return res.status(200).json({
        texto: textoFallback,
        aviso: "Resposta gerada em modo local porque o limite da OpenAI foi atingido."
      });
    }

    const mensagemBase =
      err?.status === 401
        ? "Chave da OpenAI invalida ou expirada."
        : err?.status === 429
          ? "Limite de uso da OpenAI atingido no momento."
          : err?.code === "ENOTFOUND" || err?.code === "ECONNRESET"
            ? "Nao foi possivel conectar ao servico da OpenAI."
            : err?.error?.message || err?.message || "Erro ao gerar resposta da IA.";

    const mensagem = typeof mensagemBase === "string" ? mensagemBase : "Erro ao gerar resposta da IA.";

    res.status(500).json({
      erro: mensagem,
      detalhes: err?.error?.message || err?.message || null
    });
  }
});

app.listen(PORT, () => {
  console.log(`Backend rodando em http://localhost:${PORT}`);
});
