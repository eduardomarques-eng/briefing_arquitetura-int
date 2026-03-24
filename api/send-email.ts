import nodemailer from 'nodemailer';

async function sendEmail(data: any) {
  const host = process.env.SMTP_HOST;
  const port = process.env.SMTP_PORT;
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS;
  const fromEmail = process.env.SMTP_FROM;

  console.log("SMTP_HOST:", host);
  console.log("SMTP_USER:", user);

  if (!host || !port || !user || !pass || !fromEmail) {
    throw new Error('Configuração SMTP incompleta');
  }

  const transporter = nodemailer.createTransport({
    host: host,
    port: Number(port),
    secure: false, // Explicit requirement
    auth: {
      user: user,
      pass: pass
    }
  });

  const mappedData = {
    nome: data.clientName || 'Não informado',
    telefone: data.clientPhone || 'Não informado',
    email: data.clientEmail || 'Não informado',
    cidade: data.clientCity || 'Não informado',
    profissao: data.clientProfession || 'Não informado',
    objetivo: data.objective || 'Não informado',
    fase: data.phase || 'Não informado',
    terreno: `Possui: ${data.hasLand || ''} - Área: ${data.landArea || ''} - Topo: ${data.topography || ''}`,
    orientacaoSolar: data.solarOrientation || 'Não informado',
    ventilacao: data.naturalVentilation || 'Não informado',
    restricoes: Array.isArray(data.landRestrictions) ? data.landRestrictions.join(', ') : 'Nenhuma',
    perfilFamiliar: `Moradores: ${data.familyMembers || ''} - Crianças: ${data.hasChildren || ''} - Pets: ${data.hasPets || ''}`,
    homeOffice: `Trabalha em casa: ${data.worksFromHome || ''} - Necessidade Específica: ${data.homeOfficeNeeds || ''}`,
    visitas: data.visitFrequency || 'Não informado',
    estilo: data.architecturalStyle || 'Não informado',
    referencias: data.visualReferences || 'Nenhuma',
    personalizacao: data.customizationLevel || 'Não informado',
    necessidades: `Dormitórios: ${data.bedrooms || ''} - Suites: ${data.suites || ''} - Banheiros: ${data.bathrooms || ''}`,
    ambientesExtras: Array.isArray(data.extraRooms) ? data.extraRooms.join(', ') : 'Nenhum',
    vagas: data.garageSpots || 'Não informado',
    clima: data.climateControl || 'Não informado',
    automacao: data.homeAutomation || 'Não informado',
    acustica: data.acousticIsolation || 'Não informado',
    investimento: data.budget || 'Não informado',
    flexibilidade: data.budgetFlexibility || 'Não informado',
    prazoInicio: data.startDeadline || 'Não informado',
    prazoFim: data.completionDeadline || 'Não informado',
    prioridadeMor: data.mainPriority || 'Não informado',
    indesejados: data.undesiredFeatures || 'Nenhum',
    expectativas: data.dreamProject || 'Não informado',
    reuniao: data.wantsMeeting || 'Não informado'
  };

  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; color: #333;">
      <h2 style="color: #2563eb; border-bottom: 2px solid #e5e7eb; padding-bottom: 10px;">Novo Briefing de Arquitetura</h2>
      <p><strong>Data:</strong> ${new Date().toLocaleDateString('pt-BR')}</p>
      <h3 style="background: #f3f4f6; padding: 8px; border-radius: 4px;">Dados Principais</h3>
      <p><strong>Nome:</strong> ${mappedData.nome}</p>
      <p><strong>Email:</strong> ${mappedData.email}</p>
      <p><strong>Telefone:</strong> ${mappedData.telefone}</p>
      <p><strong>Objetivo:</strong> ${mappedData.objetivo}</p>
      <p><strong>Projeto dos sonhos:</strong> ${mappedData.expectativas}</p>
    </div>
  `;

  const mailOptions = {
    from: `"Briefing Arquitetura" <${fromEmail}>`,
    to: user,
    subject: 'Novo briefing recebido – ' + (mappedData.nome || 'Cliente'),
    html: html
  };

  await transporter.sendMail(mailOptions);
}

export default async function handler(req: any, res: any) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const data = req.body || {};
    await sendEmail(data);
    return res.status(200).json({ success: true, message: "Recebemos suas informações." });
  } catch (error: any) {
    console.error('Erro no disparador de email:', error);
    if (error.message === 'Configuração SMTP incompleta') {
      return res.status(500).json({ error: 'Configuração SMTP incompleta' });
    }
    return res.status(500).json({ error: 'Falha ao enviar email' });
  }
}
