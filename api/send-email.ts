import nodemailer from 'nodemailer';

async function sendEmail(data: any) {
  const host = process.env.SMTP_HOST;
  const port = process.env.SMTP_PORT;
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS;
  const fromEmail = process.env.SMTP_FROM || user;

  // Log rigoroso das chaves para debug no painel da Vercel
  console.log("=== DIAGNÓSTICO SMTP VERCEL ===");
  console.log("SMTP_HOST:", host);
  console.log("SMTP_PORT:", port);
  console.log("SMTP_USER:", user ? "Configurado (Oculto)" : "AUSENTE");
  console.log("SMTP_PASS:", pass ? "Configurado (Oculto)" : "AUSENTE");
  console.log("SMTP_FROM:", fromEmail);
  console.log("===============================");

  if (!host || !port || !user || !pass) {
    throw new Error('Configuração SMTP incompleta');
  }

  const transporter = nodemailer.createTransport({
    host: host,
    port: parseInt(port),
    secure: parseInt(port) === 465,
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
    
    // Terreno
    terreno: `Possui: ${data.hasLand || ''} - Área: ${data.landArea || ''} - Topo: ${data.topography || ''}`,
    orientacaoSolar: data.solarOrientation || 'Não informado',
    ventilacao: data.naturalVentilation || 'Não informado',
    restricoes: Array.isArray(data.landRestrictions) ? data.landRestrictions.join(', ') : 'Nenhuma',

    // Família
    perfilFamiliar: `Moradores: ${data.familyMembers || ''} - Crianças: ${data.hasChildren || ''} - Pets: ${data.hasPets || ''}`,
    homeOffice: `Trabalha em casa: ${data.worksFromHome || ''} - Necessidade Específica: ${data.homeOfficeNeeds || ''}`,
    visitas: data.visitFrequency || 'Não informado',

    // Estilo
    estilo: data.architecturalStyle || 'Não informado',
    referencias: data.visualReferences || 'Nenhuma',
    personalizacao: data.customizationLevel || 'Não informado',

    // Necessidades
    necessidades: `Dormitórios: ${data.bedrooms || ''} - Suites: ${data.suites || ''} - Banheiros: ${data.bathrooms || ''}`,
    ambientesExtras: Array.isArray(data.extraRooms) ? data.extraRooms.join(', ') : 'Nenhum',
    vagas: data.garageSpots || 'Não informado',

    // Conforto
    clima: data.climateControl || 'Não informado',
    automacao: data.homeAutomation || 'Não informado',
    acustica: data.acousticIsolation || 'Não informado',

    // Orçamento & Prazos
    investimento: data.budget || 'Não informado',
    flexibilidade: data.budgetFlexibility || 'Não informado',
    prazoInicio: data.startDeadline || 'Não informado',
    prazoFim: data.completionDeadline || 'Não informado',

    // Prioridades e Sonhos
    prioridadeMor: data.mainPriority || 'Não informado',
    indesejados: data.undesiredFeatures || 'Nenhum',
    expectativas: data.dreamProject || 'Não informado',
    reuniao: data.wantsMeeting || 'Não informado'
  };

  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; color: #333;">
      <h2 style="color: #2563eb; border-bottom: 2px solid #e5e7eb; padding-bottom: 10px;">Novo Briefing de Arquitetura</h2>
      <p><strong>Data:</strong> ${new Date().toLocaleDateString('pt-BR')}</p>
      
      <h3 style="background: #f3f4f6; padding: 8px; border-radius: 4px;">1. Perfil e Dados de Contato</h3>
      <p><strong>Nome:</strong> ${mappedData.nome}</p>
      <p><strong>Email:</strong> ${mappedData.email}</p>
      <p><strong>Telefone:</strong> ${mappedData.telefone}</p>
      <p><strong>Cidade/Estado:</strong> ${mappedData.cidade}</p>
      <p><strong>Profissão:</strong> ${mappedData.profissao}</p>
      <p><strong>Objetivo:</strong> ${mappedData.objetivo}</p>
      <p><strong>Fase Atual:</strong> ${mappedData.fase}</p>

      <h3 style="background: #f3f4f6; padding: 8px; border-radius: 4px;">2. O Terreno</h3>
      <p><strong>Detalhes Base:</strong> ${mappedData.terreno}</p>
      <p><strong>Orientação Solar:</strong> ${mappedData.orientacaoSolar}</p>
      <p><strong>Ventilação:</strong> ${mappedData.ventilacao}</p>
      <p><strong>Restrições do Lote:</strong> ${mappedData.restricoes}</p>

      <h3 style="background: #f3f4f6; padding: 8px; border-radius: 4px;">3. Dinâmica Familiar</h3>
      <p><strong>Moradores:</strong> ${mappedData.perfilFamiliar}</p>
      <p><strong>Home Office:</strong> ${mappedData.homeOffice}</p>
      <p><strong>Frequência de Visitas:</strong> ${mappedData.visitas}</p>

      <h3 style="background: #f3f4f6; padding: 8px; border-radius: 4px;">4. Estilo de Arquitetura</h3>
      <p><strong>Estilo Desejado:</strong> ${mappedData.estilo}</p>
      <p><strong>Personalização:</strong> ${mappedData.personalizacao}</p>
      <p><strong>Referências Visuais:</strong> ${mappedData.referencias}</p>

      <h3 style="background: #f3f4f6; padding: 8px; border-radius: 4px;">5. Escopo e Necessidades</h3>
      <p><strong>Composição:</strong> ${mappedData.necessidades}</p>
      <p><strong>Ambientes Extras:</strong> ${mappedData.ambientesExtras}</p>
      <p><strong>Vagas de Garagem:</strong> ${mappedData.vagas}</p>

      <h3 style="background: #f3f4f6; padding: 8px; border-radius: 4px;">6. Conforto e Tecnologia</h3>
      <p><strong>Climatização:</strong> ${mappedData.clima}</p>
      <p><strong>Automação:</strong> ${mappedData.automacao}</p>
      <p><strong>Isolamento Acústico:</strong> ${mappedData.acustica}</p>

      <h3 style="background: #f3f4f6; padding: 8px; border-radius: 4px;">7. Orçamento e Prazos</h3>
      <p><strong>Investimento Estimado:</strong> ${mappedData.investimento}</p>
      <p><strong>Flexibilidade Orçamentária:</strong> ${mappedData.flexibilidade}</p>
      <p><strong>Prazo para Iniciarmos:</strong> ${mappedData.prazoInicio}</p>
      <p><strong>Cronograma Desejado de Fim:</strong> ${mappedData.prazoFim}</p>

      <h3 style="background: #f3f4f6; padding: 8px; border-radius: 4px;">8. Prioridades e Sonhos</h3>
      <p><strong>Foco #1 Inegociável:</strong> ${mappedData.prioridadeMor}</p>
      <p><strong>O que NÃO ter no projeto:</strong> ${mappedData.indesejados}</p>
      <p><strong>O Projeto dos Sonhos:</strong> ${mappedData.expectativas}</p>
      <p><strong>Solicitou reunião inicial:</strong> ${mappedData.reuniao}</p>
    </div>
  `;

  const mailOptions = {
    from: `"Briefing Arquitetura" <${fromEmail}>`,
    to: user,
    subject: 'Novo briefing recebido – ' + (mappedData.nome || 'Cliente') + ' – ' + new Date().toLocaleDateString('pt-BR'),
    html: html
  };

  await transporter.sendMail(mailOptions);
}

export default async function handler(req: any, res: any) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const data = req.body || {};
    await sendEmail(data);
    return res.status(200).json({ success: true, message: "Recebemos suas informações. Em breve entraremos em contato para dar início ao seu projeto exclusivo." });
  } catch (error: any) {
    console.error('Erro no disparador de email da Vercel:', error);
    
    // Devolver erro SMTP incompleto perfeitamente padronizado
    if (error.message === 'Configuração SMTP incompleta') {
      return res.status(500).json({ success: false, message: 'Configuração SMTP incompleta' });
    }

    return res.status(500).json({ success: false, message: error.message || "Falha ao enviar." });
  }
}
