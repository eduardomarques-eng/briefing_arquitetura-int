import nodemailer from 'nodemailer';

export default async function handler(req: any, res: any) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS;

  if (!user || !pass) {
    return res.status(500).json({ success: false, message: 'Configuração SMTP ausente' });
  }

  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: { user, pass }
  });

  const data = req.body || {};

  const mappedData = {
    nome: data.clientName || "Não informado",
    telefone: data.clientPhone || "Não informado",
    email: data.clientEmail || "Não informado",
    terreno: 'Possui: ' + (data.hasLand || '') + ' - Área: ' + (data.landArea || '') + ' - Topografia: ' + (data.topography || ''),
    perfilFamiliar: 'Moradores: ' + (data.familyMembers || '') + ' - Crianças: ' + (data.hasChildren || '') + ' - Pets: ' + (data.hasPets || ''),
    estiloVida: 'Trabalha de casa: ' + (data.workFromHome || '') + ' - Rotina: ' + (data.weekdayRoutine || ''),
    necessidades: 'Dormitórios: ' + (data.bedrooms || '') + ' - Suites: ' + (data.suites || '') + ' - Banheiros: ' + (data.bathrooms || ''),
    investimento: data.budget || "Não informado",
    expectativas: data.idealHouse || "Não informado",
  };

  const html = `
    <h2>Novo Briefing de Arquitetura Recebido</h2>
    <p><strong>Data:</strong> ${new Date().toLocaleDateString('pt-BR')}</p>
    
    <h3>Dados do Cliente</h3>
    <p><strong>Nome:</strong> ${mappedData.nome}</p>
    <p><strong>Telefone:</strong> ${mappedData.telefone}</p>
    <p><strong>Email:</strong> ${mappedData.email}</p>

    <h3>Informações do Projeto</h3>
    <p><strong>Terreno:</strong> ${mappedData.terreno}</p>
    <p><strong>Perfil Familiar:</strong> ${mappedData.perfilFamiliar}</p>
    <p><strong>Estilo de Vida:</strong> ${mappedData.estiloVida}</p>
    <p><strong>Necessidades do Projeto:</strong> ${mappedData.necessidades}</p>
    <p><strong>Investimento Previsto:</strong> ${mappedData.investimento}</p>
    <p><strong>Expectativas:</strong> ${mappedData.expectativas}</p>
  `;

  const mailOptions = {
    from: '"Briefing Arquitetura" <' + user + '>',
    to: user,
    subject: 'Novo briefing recebido – ' + (mappedData.nome || 'Cliente') + ' – ' + new Date().toLocaleDateString('pt-BR'),
    html: html
  };

  try {
    await transporter.sendMail(mailOptions);
    return res.status(200).json({ success: true, message: "Recebemos suas informações. Em breve entraremos em contato para dar início ao seu projeto exclusivo." });
  } catch (error: any) {
    console.error('Erro SMTP na Vercel:', error);
    return res.status(500).json({ success: false, message: error.message || "Falha ao enviar." });
  }
}
