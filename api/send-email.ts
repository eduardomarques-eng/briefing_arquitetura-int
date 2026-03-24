import nodemailer from 'nodemailer';

async function sendEmail(data: any) {
  const host = process.env.SMTP_HOST || 'smtp.gmail.com';
  const port = process.env.SMTP_PORT || '587';
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS;
  const fromEmail = process.env.SMTP_FROM || user;

  console.log("SMTP_HOST:", host);
  console.log("SMTP_USER:", user);

  if (!host || !port || !user || !pass || !fromEmail) {
    throw new Error('Configuração SMTP incompleta');
  }

  const transporter = nodemailer.createTransport({
    host: host,
    port: Number(port),
    secure: false, // TLS exige false para a porta 587
    auth: {
      user: user,
      pass: pass
    },
    logger: true,
    debug: true
  });

  // Validar Conexão SMTP rigidamente antes de prosseguir
  try {
    await transporter.verify();
    console.log('✅ Conexão SMTP verificada e logada com sucesso!');
  } catch (verifyError: any) {
    console.error("❌ Erro SMTP (Falha de Verificação / Auth):", verifyError);
    throw new Error(`Falha de Verificação SMTP: ${verifyError.message}`);
  }

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
    <div style="background-color: #f9f9f9; padding: 20px; font-family: 'Montserrat', Arial, sans-serif; color: #333333;">
      <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 8px; box-shadow: 0 4px 10px rgba(0,0,0,0.05); overflow: hidden;">
        
        <div style="background-color: #2563eb; padding: 25px 20px; text-align: center; color: #ffffff;">
          <h1 style="margin: 0; font-size: 24px; font-weight: 600;">Novo Briefing Recebido</h1>
          <p style="margin: 5px 0 0 0; font-size: 14px; opacity: 0.9;">Data do envio: ${new Date().toLocaleDateString('pt-BR')}</p>
        </div>

        <div style="padding: 30px 25px;">
          
          <div style="margin-bottom: 25px;">
            <h3 style="color: #2563eb; font-size: 16px; border-bottom: 2px solid #f0f0f0; padding-bottom: 8px; margin-top: 0;">👤 DADOS DO CLIENTE</h3>
            <p style="margin: 8px 0; font-size: 14px;"><strong>Nome:</strong> ${mappedData.nome}</p>
            <p style="margin: 8px 0; font-size: 14px;"><strong>Email:</strong> ${mappedData.email}</p>
            <p style="margin: 8px 0; font-size: 14px;"><strong>Telefone:</strong> ${mappedData.telefone}</p>
            <p style="margin: 8px 0; font-size: 14px;"><strong>Cidade/Estado:</strong> ${mappedData.cidade}</p>
            <p style="margin: 8px 0; font-size: 14px;"><strong>Profissão:</strong> ${mappedData.profissao}</p>
          </div>

          <div style="margin-bottom: 25px;">
            <h3 style="color: #2563eb; font-size: 16px; border-bottom: 2px solid #f0f0f0; padding-bottom: 8px;">🎯 QUALIFICAÇÃO</h3>
            <p style="margin: 8px 0; font-size: 14px;"><strong>Fase Atual do Projeto:</strong> ${mappedData.fase}</p>
            <p style="margin: 8px 0; font-size: 14px;"><strong>Objetivo Principal:</strong> ${mappedData.objetivo}</p>
            <p style="margin: 8px 0; font-size: 14px;"><strong>Projeto dos Sonhos:</strong> ${mappedData.expectativas}</p>
            <p style="margin: 8px 0; font-size: 14px;"><strong>Prioridade Inegociável:</strong> ${mappedData.prioridadeMor}</p>
            <p style="margin: 8px 0; font-size: 14px;"><strong>O que NÃO ter:</strong> ${mappedData.indesejados}</p>
          </div>

          <div style="margin-bottom: 25px;">
            <h3 style="color: #2563eb; font-size: 16px; border-bottom: 2px solid #f0f0f0; padding-bottom: 8px;">🏞️ O TERRENO</h3>
            <p style="margin: 8px 0; font-size: 14px;"><strong>Situação Atual:</strong> ${mappedData.terreno}</p>
            <p style="margin: 8px 0; font-size: 14px;"><strong>Orientação Solar:</strong> ${mappedData.orientacaoSolar}</p>
            <p style="margin: 8px 0; font-size: 14px;"><strong>Ventilação:</strong> ${mappedData.ventilacao}</p>
            <p style="margin: 8px 0; font-size: 14px;"><strong>Restrições do Lote:</strong> ${mappedData.restricoes}</p>
          </div>

          <div style="margin-bottom: 25px;">
            <h3 style="color: #2563eb; font-size: 16px; border-bottom: 2px solid #f0f0f0; padding-bottom: 8px;">👨‍👩‍👧‍👦 A FAMÍLIA</h3>
            <p style="margin: 8px 0; font-size: 14px;"><strong>Composição:</strong> ${mappedData.perfilFamiliar}</p>
            <p style="margin: 8px 0; font-size: 14px;"><strong>Home Office:</strong> ${mappedData.homeOffice}</p>
            <p style="margin: 8px 0; font-size: 14px;"><strong>Frequência de Visitas:</strong> ${mappedData.visitas}</p>
          </div>

          <div style="margin-bottom: 25px;">
            <h3 style="color: #2563eb; font-size: 16px; border-bottom: 2px solid #f0f0f0; padding-bottom: 8px;">🏠 NECESSIDADES E ESCOPO</h3>
            <p style="margin: 8px 0; font-size: 14px;"><strong>Dormitórios/Suítes/Banheiros:</strong> ${mappedData.necessidades}</p>
            <p style="margin: 8px 0; font-size: 14px;"><strong>Vagas de Garagem:</strong> ${mappedData.vagas}</p>
            <p style="margin: 8px 0; font-size: 14px;"><strong>Ambientes Extras:</strong> ${mappedData.ambientesExtras}</p>
            <p style="margin: 8px 0; font-size: 14px;"><strong>Climatização:</strong> ${mappedData.clima}</p>
            <p style="margin: 8px 0; font-size: 14px;"><strong>Automação:</strong> ${mappedData.automacao}</p>
            <p style="margin: 8px 0; font-size: 14px;"><strong>Isolamento Acústico:</strong> ${mappedData.acustica}</p>
          </div>

          <div style="margin-bottom: 25px;">
            <h3 style="color: #2563eb; font-size: 16px; border-bottom: 2px solid #f0f0f0; padding-bottom: 8px;">✨ INFORMAÇÕES ADICIONAIS E ESTILO</h3>
            <p style="margin: 8px 0; font-size: 14px;"><strong>Estilo Desejado:</strong> ${mappedData.estilo}</p>
            <p style="margin: 8px 0; font-size: 14px;"><strong>Personalização:</strong> ${mappedData.personalizacao}</p>
            <p style="margin: 8px 0; font-size: 14px;"><strong>Referências:</strong> ${mappedData.referencias}</p>
            <div style="background-color: #f0f7ff; padding: 15px; border-radius: 6px; margin-top: 15px;">
              <p style="margin: 0 0 8px 0; font-size: 14px; color: #1e40af;"><strong>💰 Investimento Previsto:</strong> <span style="font-size: 15px;">${mappedData.investimento}</span></p>
              <p style="margin: 0 0 8px 0; font-size: 14px; color: #1e40af;"><strong>📊 Flexibilidade Orçamentária:</strong> ${mappedData.flexibilidade}</p>
              <p style="margin: 0 0 8px 0; font-size: 14px; color: #1e40af;"><strong>📅 Prazo para Início:</strong> ${mappedData.prazoInicio}</p>
              <p style="margin: 0; font-size: 14px; color: #1e40af;"><strong>⏰ Conclusão Desejada:</strong> ${mappedData.prazoFim}</p>
            </div>
          </div>

        </div>

        <div style="background-color: #f3f4f6; padding: 20px; text-align: center; border-top: 1px solid #e5e7eb;">
          <p style="margin: 0 0 5px 0; font-size: 13px; color: #6b7280; font-weight: 600;">Projeto gerado automaticamente</p>
          <p style="margin: 0 0 10px 0; font-size: 13px; color: #6b7280;">Sistema de Briefing Arquitetônico</p>
          <p style="margin: 0; font-size: 13px; color: #6b7280;">Email: <a href="mailto:eduardo.marques.arq@gmail.com" style="color: #2563eb; text-decoration: none;">eduardo.marques.arq@gmail.com</a></p>
        </div>

      </div>
    </div>
  `;

  const mailOptions = {
    from: `"Briefing Arquitetura" <${fromEmail}>`,
    to: user,
    subject: `Novo briefing recebido - ${mappedData.nome}`,
    html: html
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log("✅ Email disparado silenciosamente (OK).");
  } catch (sendError: any) {
    console.error("❌ Erro SMTP (Disparo de Email):", sendError);
    throw new Error(`Erro no envio do email: ${sendError.message}`);
  }
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
    console.error("Erro SMTP (Rota Principal catch):", error);
    
    // Tratamento exigido pelo Prompt: Retornar erro real no backend: { error: error.message }
    return res.status(500).json({ error: error.message || 'Falha catastrófica no backend' });
  }
}
