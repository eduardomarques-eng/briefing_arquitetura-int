import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const data: Record<string, any> = {};
    const attachments: any[] = [];

    for (const [key, value] of formData.entries()) {
      if (value instanceof File) {
        if (value.size === 0) continue;
        const buffer = Buffer.from(await value.arrayBuffer());
        attachments.push({
          filename: value.name,
          content: buffer,
          contentType: value.type,
        });
      } else {
        if (data[key]) {
          if (Array.isArray(data[key])) {
            data[key].push(value);
          } else {
            data[key] = [data[key], value];
          }
        } else {
          data[key] = value;
        }
      }
    }

    // Check environment variables
    if (!process.env.SMTP_HOST || !process.env.SMTP_USER || !process.env.SMTP_PASS) {
      console.error('Missing SMTP credentials in environment variables');
      return NextResponse.json(
        { error: 'Configuração de servidor de email ausente.' },
        { status: 500 }
      );
    }

    // Create transporter
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: Number(process.env.SMTP_PORT) || 587,
      secure: false, // true for 465, false for other ports
      requireTLS: true, // Force TLS
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });

    // Verify connection configuration
    try {
      await transporter.verify();
      console.log('Server is ready to take our messages');
    } catch (verifyError) {
      console.error('SMTP Verification Error:', verifyError);
      return NextResponse.json(
        { error: 'Falha na conexão com o servidor de email.' },
        { status: 500 }
      );
    }

    // Format HTML email
    const generateSection = (title: string, fields: { label: string; value: any }[]) => {
      const validFields = fields.filter(f => f.value && f.value !== '');
      if (validFields.length === 0) return '';
      
      return `
        <div class="section">
          <h3 class="section-title">${title}</h3>
          ${validFields.map(f => `
            <div class="field">
              <span class="label">${f.label}:</span>
              <span class="value">${Array.isArray(f.value) ? f.value.join(', ') : f.value}</span>
            </div>
          `).join('')}
        </div>
      `;
    };

    const htmlContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 800px; margin: 0 auto; padding: 20px; }
          .header { background-color: #f8f9fa; padding: 20px; text-align: center; border-bottom: 3px solid #D4AF37; margin-bottom: 30px; }
          .section { margin-bottom: 25px; padding: 20px; border: 1px solid #eaeaea; border-radius: 8px; background-color: #fff; }
          .section-title { color: #D4AF37; margin-top: 0; border-bottom: 1px solid #eaeaea; padding-bottom: 10px; font-size: 18px; }
          .field { margin-bottom: 12px; display: flex; flex-direction: column; }
          .label { font-weight: bold; color: #555; font-size: 14px; margin-bottom: 4px; }
          .value { color: #222; font-size: 15px; background-color: #fcfcfc; padding: 8px 12px; border-radius: 4px; border-left: 3px solid #D4AF37; }
        </style>
      </head>
      <body style="background-color: #f5f5f5; padding: 20px 0;">
        <div class="container">
          <div class="header">
            <h2 style="margin: 0; color: #222;">Novo Briefing Completo</h2>
            <p style="margin: 10px 0 0 0; color: #666;">Um novo cliente preencheu o formulário de arquitetura.</p>
          </div>
          
          ${generateSection('1. Identificação do Cliente', [
            { label: 'Nome', value: data.nome },
            { label: 'Telefone', value: data.telefone },
            { label: 'E-mail', value: data.email },
            { label: 'Profissão', value: data.profissao },
            { label: 'Estado Civil', value: data.estadoCivil },
            { label: 'Como conheceu', value: data.comoConheceu },
            { label: 'Cidade/Estado', value: data.cidadeEstado },
          ])}

          ${generateSection('2. Perfil Familiar', [
            { label: 'Moradores', value: data.moradores },
            { label: 'Idades', value: data.idades },
            { label: 'Crianças', value: data.criancas },
            { label: 'Idosos', value: data.idosos },
            { label: 'Pets', value: data.pets },
            { label: 'Pretende aumentar a família', value: data.aumentarFamilia },
          ])}

          ${generateSection('3. Informações do Terreno', [
            { label: 'Endereço', value: data.enderecoTerreno },
            { label: 'Área Total', value: data.areaTerreno },
            { label: 'Dimensões', value: data.dimensoes },
            { label: 'Topografia', value: data.topografia },
            { label: 'Posição Solar', value: data.posicaoSolar },
            { label: 'Condomínio', value: data.condominio },
            { label: 'Levantamento Topográfico', value: data.levantamentoTopografico },
            { label: 'Sondagem do Solo', value: data.sondagemSolo },
          ])}

          ${generateSection('4. Objetivo do Projeto', [
            { label: 'Tipo de Projeto', value: data.tipoProjeto },
            { label: 'Finalidade', value: data.finalidade },
            { label: 'Construir Imediatamente', value: data.construirImediatamente },
            { label: 'Financiamento Aprovado', value: data.financiamentoAprovado },
          ])}

          ${generateSection('5. Programa de Necessidades (Térreo)', [
            { label: 'Sala de Estar', value: data.salaEstar },
            { label: 'Sala de Jantar', value: data.salaJantar },
            { label: 'Cozinha', value: data.cozinha },
            { label: 'Lavabo', value: data.lavabo },
            { label: 'Escritório', value: data.escritorio },
            { label: 'Suíte Térrea', value: data.suiteTerrea },
            { label: 'Área Gourmet', value: data.areaGourmet },
            { label: 'Piscina', value: data.piscina },
            { label: 'Garagem', value: data.garagem },
          ])}

          ${generateSection('5. Programa de Necessidades (Superior)', [
            { label: 'Suítes', value: data.suites },
            { label: 'Suíte Master', value: data.suiteMaster },
            { label: 'Closet', value: data.closet },
            { label: 'Varanda', value: data.varanda },
            { label: 'Sala Íntima / TV', value: data.salaIntima },
          ])}

          ${generateSection('5. Programa de Necessidades (Complementares)', [
            { label: 'Lavanderia', value: data.lavanderia },
            { label: 'Dependência de Serviço', value: data.dependenciaServico },
            { label: 'Depósito', value: data.deposito },
            { label: 'Academia', value: data.academia },
            { label: 'Cinema / Home Theater', value: data.cinema },
            { label: 'Adega', value: data.adega },
            { label: 'Spa / Sauna', value: data.spa },
            { label: 'Elevador', value: data.elevador },
          ])}

          ${generateSection('6. Estilo Arquitetônico', [
            { label: 'Estilo Desejado', value: data.estiloDesejado },
            { label: 'Referências', value: data.referencias },
            { label: 'Materiais Preferidos', value: data.materiaisPreferidos },
            { label: 'Cores Preferidas', value: data.coresPreferidas },
            { label: 'Cores que NÃO gosta', value: data.coresNaoGosta },
          ])}

          ${generateSection('7. Conforto e Tecnologia', [
            { label: 'Automação Residencial', value: data.automacao },
            { label: 'Energia Solar', value: data.energiaSolar },
            { label: 'Sistema de Segurança', value: data.sistemaSeguranca },
            { label: 'Climatização', value: data.climatizacao },
            { label: 'Aquecimento de Água', value: data.aquecimentoAgua },
            { label: 'Iluminação', value: data.iluminacao },
          ])}

          ${generateSection('8. Estilo de Vida', [
            { label: 'Recebe Visitas', value: data.recebeVisitas },
            { label: 'Frequência de Eventos', value: data.frequenciaEventos },
            { label: 'Prefere Ambientes', value: data.prefereAmbientes },
            { label: 'Trabalha em Casa', value: data.trabalhaEmCasa },
            { label: 'Prioriza', value: data.prioriza },
          ])}

          ${generateSection('9. Área Externa', [
            { label: 'Piscina Externa', value: data.piscinaExterna },
            { label: 'Churrasqueira / Gourmet', value: data.churrasqueira },
            { label: 'Jardim', value: data.jardim },
            { label: 'Espaço Kids', value: data.espacoKids },
            { label: 'Área Pet', value: data.areaPet },
            { label: 'Deck / Varanda', value: data.deckVaranda },
          ])}

          ${generateSection('10. Orçamento', [
            { label: 'Valor Previsto', value: data.valorPrevisto },
            { label: 'Nível Desejado', value: data.nivelDesejado },
            { label: 'Flexibilidade', value: data.flexibilidade },
          ])}

          ${generateSection('11. Prazos', [
            { label: 'Início do Projeto', value: data.inicioProjeto },
            { label: 'Início da Obra', value: data.inicioObra },
            { label: 'Conclusão', value: data.conclusao },
          ])}

          ${generateSection('12. Expectativas', [
            { label: 'O que NÃO pode faltar', value: data.naoPodeFaltar },
            { label: 'Projeto Perfeito', value: data.projetoPerfeito },
            { label: 'Necessidade Específica', value: data.necessidadeEspecifica },
            { label: 'Restrição', value: data.restricao },
          ])}

          ${generateSection('13. Documentos', [
            { label: 'Matrícula', value: data.matricula },
            { label: 'Escritura', value: data.escritura },
            { label: 'Planialtimétrico', value: data.planialtimetrico },
            { label: 'Projeto Anterior', value: data.projetoAnterior },
          ])}

          ${generateSection('14. Observações Finais', [
            { label: 'Observações', value: data.observacoes },
          ])}

          ${generateSection('🔥 Diferencial', [
            { label: 'Por que escolheu nosso escritório?', value: data.porqueEscolheu },
          ])}
        </div>
      </body>
      </html>
    `;

    // Send email
    const info = await transporter.sendMail({
      from: `"Briefing Arquitetura" <${process.env.SMTP_USER}>`,
      to: 'eduardo.marques.arq@gmail.com',
      subject: 'Novo briefing recebido – Cliente Arquitetura',
      text: `Novo briefing de ${data.nome}. Email: ${data.email}. Telefone: ${data.telefone}`, // plain text body
      html: htmlContent,
      attachments: attachments,
    });

    console.log('Message sent: %s', info.messageId);

    return NextResponse.json({ success: true, messageId: info.messageId });
  } catch (error) {
    console.error('Error sending email:', error);
    return NextResponse.json(
      { error: 'Ocorreu um erro ao enviar o email. Tente novamente mais tarde.' },
      { status: 500 }
    );
  }
}
