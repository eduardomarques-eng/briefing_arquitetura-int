'use client';

import { useRef, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { CheckCircle2, Loader2, ChevronRight, ChevronLeft } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Input, Textarea, RadioGroup, CheckboxGroup, SectionTitle, FileInput, NumberInput, ImageRadioGroup, CurrencyInput } from './ui-elements';

const formSchema = z.object({
  // 1. IDENTIFICAÇÃO DO CLIENTE
  nome: z.string().min(2, 'Nome é obrigatório'),
  telefone: z.string().min(10, 'Telefone é obrigatório'),
  email: z.string().email('Email inválido'),
  profissao: z.string().optional(),
  estadoCivil: z.string().optional(),
  comoConheceu: z.string().optional(),
  cidadeEstado: z.string().min(2, 'Cidade e estado são obrigatórios'),

  // 2. PERFIL FAMILIAR
  moradores: z.string().optional(),
  idades: z.string().optional(),
  criancas: z.string().optional(),
  idosos: z.string().optional(),
  pets: z.string().optional(),
  aumentarFamilia: z.string().optional(),

  // 3. INFORMAÇÕES DO TERRENO
  enderecoTerreno: z.string().optional(),
  areaTerreno: z.string().optional(),
  dimensoes: z.string().optional(),
  topografia: z.string().optional(),
  posicaoSolar: z.string().optional(),
  condominio: z.string().optional(),
  levantamentoTopografico: z.string().optional(),
  sondagemSolo: z.string().optional(),
  arquivosTerreno: z.any().optional(),

  // 4. OBJETIVO DO PROJETO
  tipoProjeto: z.string().optional(),
  finalidade: z.string().optional(),
  construirImediatamente: z.string().optional(),
  financiamentoAprovado: z.string().optional(),

  // 5. PROGRAMA DE NECESSIDADES
  salaEstar: z.string().optional(),
  salaJantar: z.string().optional(),
  cozinha: z.string().optional(),
  lavabo: z.string().optional(),
  escritorio: z.string().optional(),
  suiteTerrea: z.string().optional(),
  areaGourmet: z.string().optional(),
  piscina: z.string().optional(),
  garagem: z.string().optional(),
  suites: z.string().optional(),
  suiteMaster: z.string().optional(),
  closet: z.string().optional(),
  varanda: z.string().optional(),
  salaIntima: z.string().optional(),
  lavanderia: z.string().optional(),
  dependenciaServico: z.string().optional(),
  deposito: z.string().optional(),
  academia: z.string().optional(),
  cinema: z.string().optional(),
  adega: z.string().optional(),
  spa: z.string().optional(),
  elevador: z.string().optional(),

  // 6. ESTILO ARQUITETÔNICO
  estiloDesejado: z.string().optional(),
  referencia1: z.string().optional(),
  referencia2: z.string().optional(),
  referencia3: z.string().optional(),
  referencia4: z.string().optional(),
  referencia5: z.string().optional(),
  imagensReferencia: z.any().optional(),
  materiaisPreferidos: z.array(z.string()).optional(),
  coresPreferidas: z.string().optional(),
  coresNaoGosta: z.string().optional(),

  // 7. CONFORTO E TECNOLOGIA
  automacao: z.string().optional(),
  energiaSolar: z.string().optional(),
  sistemaSeguranca: z.string().optional(),
  climatizacao: z.string().optional(),
  aquecimentoAgua: z.string().optional(),
  iluminacao: z.string().optional(),

  // 8. ESTILO DE VIDA
  recebeVisitas: z.string().optional(),
  frequenciaEventos: z.string().optional(),
  prefereAmbientes: z.string().optional(),
  trabalhaEmCasa: z.string().optional(),
  prioriza: z.string().optional(),

  // 9. ÁREA EXTERNA
  piscinaExterna: z.string().optional(),
  churrasqueira: z.string().optional(),
  jardim: z.string().optional(),
  espacoKids: z.string().optional(),
  areaPet: z.string().optional(),
  deckVaranda: z.string().optional(),

  // 10. ORÇAMENTO
  valorPrevisto: z.string().optional(),
  nivelDesejado: z.string().optional(),
  flexibilidade: z.string().optional(),

  // 11. PRAZOS
  inicioProjeto: z.string().optional(),
  inicioObra: z.string().optional(),
  conclusao: z.string().optional(),

  // 12. EXPECTATIVAS
  naoPodeFaltar: z.string().optional(),
  projetoPerfeito: z.string().optional(),
  necessidadeEspecifica: z.string().optional(),
  restricao: z.string().optional(),

  // 13. DOCUMENTOS
  matricula: z.string().optional(),
  escritura: z.string().optional(),
  planialtimetrico: z.string().optional(),
  projetoAnterior: z.string().optional(),
  arquivosDocumentos: z.any().optional(),

  // 14. OBSERVAÇÕES FINAIS
  observacoes: z.string().optional(),
  porqueEscolheu: z.string().optional(),
});

type FormData = z.infer<typeof formSchema>;

const STEPS = [
  { id: 1, title: 'Identificação & Perfil' },
  { id: 2, title: 'Terreno & Objetivo' },
  { id: 3, title: 'Necessidades' },
  { id: 4, title: 'Estilo & Tecnologia' },
  { id: 5, title: 'Estilo de Vida & Área Externa' },
  { id: 6, title: 'Orçamento & Prazos' },
  { id: 7, title: 'Expectativas & Finalização' },
];

export function BriefingForm() {
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const formRef = useRef<HTMLDivElement>(null);

  const {
    register,
    handleSubmit,
    trigger,
    setValue,
    watch,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(formSchema),
    mode: 'onTouched',
  });

  const scrollToTop = () => {
    if (formRef.current) {
      const yOffset = -100; // Offset for fixed headers if any
      const y = formRef.current.getBoundingClientRect().top + window.pageYOffset + yOffset;
      window.scrollTo({ top: y, behavior: 'smooth' });
    } else {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const nextStep = async () => {
    let fieldsToValidate: any[] = [];
    if (currentStep === 1) {
      fieldsToValidate = ['nome', 'telefone', 'email', 'cidadeEstado'];
    }
    
    const isStepValid = await trigger(fieldsToValidate as any);
    if (isStepValid) {
      setCurrentStep((prev) => Math.min(prev + 1, STEPS.length));
      scrollToTop();
    }
  };

  const prevStep = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 1));
    scrollToTop();
  };

  const onSubmit = async (data: FormData) => {
    setIsSubmitting(true);
    setErrorMessage('');

    try {
      const formDataToSend = new FormData();
      
      Object.entries(data).forEach(([key, value]) => {
        if (typeof window !== 'undefined' && value instanceof FileList) {
          Array.from(value).forEach(file => {
            formDataToSend.append(key, file);
          });
        } else if (Array.isArray(value)) {
          value.forEach(v => formDataToSend.append(key, v));
        } else if (value !== undefined && value !== null && value !== '') {
          formDataToSend.append(key, value as string);
        }
      });

      const response = await fetch('/api/send-email', {
        method: 'POST',
        body: formDataToSend,
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Erro ao enviar formulário');
      }

      setIsSuccess(true);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (error) {
      console.error('Error submitting form:', error);
      setErrorMessage(
        error instanceof Error ? error.message : 'Ocorreu um erro inesperado. Tente novamente.'
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSuccess) {
    return (
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-white p-10 md:p-16 rounded-3xl text-center max-w-2xl mx-auto"
      >
        <div className="flex justify-center mb-8">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 200, damping: 20, delay: 0.2 }}
            className="w-24 h-24 bg-[#F8F7F5] rounded-full flex items-center justify-center"
          >
            <CheckCircle2 className="w-12 h-12 text-[#1A1A1A]" />
          </motion.div>
        </div>
        <h2 className="text-4xl font-serif font-medium text-[#1A1A1A] mb-4">
          Briefing Enviado!
        </h2>
        <p className="text-lg text-[#5A5A5A] font-light leading-relaxed">
          Agradecemos por compartilhar sua visão conosco. Nossa equipe analisará as informações e entrará em contato em breve para darmos o próximo passo.
        </p>
      </motion.div>
    );
  }

  return (
    <div ref={formRef} className="bg-white p-6 sm:p-12 md:p-16 rounded-3xl max-w-4xl mx-auto">
      {/* Progress Bar */}
      <div className="mb-12">
        <div className="flex justify-between items-center mb-3 px-1">
          <span className="text-xs font-semibold tracking-widest uppercase text-[#8A8375]">Passo {currentStep} de {STEPS.length}</span>
          <span className="text-sm font-medium text-[#1A1A1A]">{STEPS[currentStep - 1].title}</span>
        </div>
        <div className="h-1.5 w-full bg-gray-100 rounded-full overflow-hidden">
          <motion.div 
            className="h-full bg-[#1A1A1A] rounded-full"
            initial={{ width: `${((currentStep - 1) / STEPS.length) * 100}%` }}
            animate={{ width: `${(currentStep / STEPS.length) * 100}%` }}
            transition={{ duration: 0.4, ease: "easeInOut" }}
          />
        </div>
      </div>

      {errorMessage && (
        <div className="mb-6 p-4 bg-red-50 text-red-700 rounded-lg border border-red-200 flex items-center">
          <span className="font-medium">{errorMessage}</span>
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentStep}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.2 }}
            className="space-y-8"
          >
            {/* STEP 1 */}
            {currentStep === 1 && (
              <>
                <div>
                  <SectionTitle>1. Identificação do Cliente</SectionTitle>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <Input label="Nome completo *" registration={register('nome')} error={errors.nome} />
                    <Input label="Telefone (WhatsApp) *" registration={register('telefone')} error={errors.telefone} />
                    <Input label="E-mail *" type="email" registration={register('email')} error={errors.email} />
                    <Input label="Profissão" registration={register('profissao')} />
                    <Input label="Estado civil" registration={register('estadoCivil')} />
                    <Input label="Como conheceu o escritório?" registration={register('comoConheceu')} />
                    <div className="md:col-span-2">
                      <Input label="Cidade e estado do projeto *" registration={register('cidadeEstado')} error={errors.cidadeEstado} />
                    </div>
                  </div>
                </div>

                <div>
                  <SectionTitle>2. Perfil Familiar</SectionTitle>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <Input label="Quantas pessoas irão morar na residência?" registration={register('moradores')} />
                    <Input label="Idades dos moradores" registration={register('idades')} />
                    <Input label="Possui crianças? Quantas?" registration={register('criancas')} />
                    <Input label="Possui idosos?" registration={register('idosos')} />
                    <Input label="Possui pets? Quais e quantos?" registration={register('pets')} />
                    <Input label="Pretende aumentar a família?" registration={register('aumentarFamilia')} />
                  </div>
                </div>
              </>
            )}

            {/* STEP 2 */}
            {currentStep === 2 && (
              <>
                <div>
                  <SectionTitle>3. Informações do Terreno</SectionTitle>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="md:col-span-2">
                      <Input label="Endereço do terreno" registration={register('enderecoTerreno')} />
                    </div>
                    <Input label="Área total do terreno (m²)" registration={register('areaTerreno')} />
                    <Input label="Dimensões (frente x fundo)" registration={register('dimensoes')} />
                    
                    <RadioGroup 
                      label="Topografia" 
                      registration={register('topografia')}
                      options={[
                        { label: 'Plano', value: 'Plano' },
                        { label: 'Aclive', value: 'Aclive' },
                        { label: 'Declive', value: 'Declive' },
                      ]}
                    />
                    
                    <Input label="Posição solar (se souber)" registration={register('posicaoSolar')} />
                    
                    <RadioGroup 
                      label="O terreno está em condomínio?" 
                      registration={register('condominio')}
                      options={[
                        { label: 'Sim', value: 'Sim' },
                        { label: 'Não', value: 'Não' },
                      ]}
                    />
                    
                    <RadioGroup 
                      label="Possui levantamento topográfico?" 
                      registration={register('levantamentoTopografico')}
                      options={[
                        { label: 'Sim', value: 'Sim' },
                        { label: 'Não', value: 'Não' },
                      ]}
                    />
                    
                    <RadioGroup 
                      label="Possui sondagem do solo?" 
                      registration={register('sondagemSolo')}
                      options={[
                        { label: 'Sim', value: 'Sim' },
                        { label: 'Não', value: 'Não' },
                      ]}
                    />
                    
                    <div className="md:col-span-2 mt-2">
                      <FileInput 
                        label="Fotos ou arquivos do terreno (Opcional)" 
                        registration={register('arquivosTerreno')} 
                        multiple 
                        accept="image/*,.pdf,.dwg"
                        helperText="Formatos aceitos: Imagens, PDF, DWG. Máx 5MB por arquivo."
                      />
                    </div>
                  </div>
                </div>

                <div>
                  <SectionTitle>4. Objetivo do Projeto</SectionTitle>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <RadioGroup 
                      label="Tipo de projeto" 
                      registration={register('tipoProjeto')}
                      options={[
                        { label: 'Residencial unifamiliar', value: 'Residencial unifamiliar' },
                        { label: 'Alto padrão', value: 'Alto padrão' },
                      ]}
                    />
                    
                    <RadioGroup 
                      label="Qual a finalidade da construção?" 
                      registration={register('finalidade')}
                      options={[
                        { label: 'Moradia (Residencial)', value: 'Moradia' },
                        { label: 'Comercial', value: 'Comercial' },
                        { label: 'Investimento / Venda', value: 'Investimento' },
                        { label: 'Veraneio / Lazer', value: 'Veraneio' },
                      ]}
                    />
                    
                    <RadioGroup 
                      label="Pretende construir imediatamente?" 
                      registration={register('construirImediatamente')}
                      options={[
                        { label: 'Sim', value: 'Sim' },
                        { label: 'Não', value: 'Não' },
                      ]}
                    />
                    
                    <RadioGroup 
                      label="Já possui financiamento aprovado?" 
                      registration={register('financiamentoAprovado')}
                      options={[
                        { label: 'Sim', value: 'Sim' },
                        { label: 'Não', value: 'Não' },
                      ]}
                    />
                  </div>
                </div>
              </>
            )}

            {/* STEP 3 */}
            {currentStep === 3 && (
              <>
                <div>
                  <SectionTitle>5. Programa de Necessidades (Essencial)</SectionTitle>
                  
                  <div className="space-y-8">
                    {/* Térreo */}
                    <div className="bg-gray-50 p-6 rounded-xl border border-gray-100">
                      <h4 className="font-serif text-lg font-medium text-[#1A1A1A] mb-4">🔹 Pavimento térreo</h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <RadioGroup 
                          label="Sala de estar?" 
                          registration={register('salaEstar')}
                          options={[{ label: 'Sim', value: 'Sim' }, { label: 'Não', value: 'Não' }]}
                        />
                        <RadioGroup 
                          label="Sala de jantar?" 
                          registration={register('salaJantar')}
                          options={[{ label: 'Sim', value: 'Sim' }, { label: 'Não', value: 'Não' }]}
                        />
                        <RadioGroup 
                          label="Cozinha" 
                          registration={register('cozinha')}
                          options={[{ label: 'Integrada', value: 'Integrada' }, { label: 'Fechada', value: 'Fechada' }]}
                        />
                        <RadioGroup 
                          label="Lavabo?" 
                          registration={register('lavabo')}
                          options={[{ label: 'Sim', value: 'Sim' }, { label: 'Não', value: 'Não' }]}
                        />
                        <RadioGroup 
                          label="Escritório / Home office?" 
                          registration={register('escritorio')}
                          options={[{ label: 'Sim', value: 'Sim' }, { label: 'Não', value: 'Não' }]}
                        />
                        <RadioGroup 
                          label="Suíte térrea?" 
                          registration={register('suiteTerrea')}
                          options={[{ label: 'Sim', value: 'Sim' }, { label: 'Não', value: 'Não' }]}
                        />
                        <RadioGroup 
                          label="Área gourmet?" 
                          registration={register('areaGourmet')}
                          options={[{ label: 'Sim', value: 'Sim' }, { label: 'Não', value: 'Não' }]}
                        />
                        <RadioGroup 
                          label="Piscina?" 
                          registration={register('piscina')}
                          options={[{ label: 'Sim', value: 'Sim' }, { label: 'Não', value: 'Não' }]}
                        />
                        <NumberInput 
                          label="Garagem: Quantos carros?" 
                          registration={register('garagem')} 
                          onIncrement={() => {
                            const current = parseInt(watch('garagem') || '0');
                            setValue('garagem', (isNaN(current) ? 1 : current + 1).toString());
                          }}
                          onDecrement={() => {
                            const current = parseInt(watch('garagem') || '0');
                            if (!isNaN(current) && current > 0) {
                              setValue('garagem', (current - 1).toString());
                            }
                          }}
                        />
                      </div>
                    </div>

                    {/* Superior */}
                    <div className="bg-gray-50 p-6 rounded-xl border border-gray-100">
                      <h4 className="font-serif text-lg font-medium text-[#1A1A1A] mb-4">🔹 Pavimento superior</h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <NumberInput 
                          label="Quantas suítes?" 
                          registration={register('suites')} 
                          onIncrement={() => {
                            const current = parseInt(watch('suites') || '0');
                            setValue('suites', (isNaN(current) ? 1 : current + 1).toString());
                          }}
                          onDecrement={() => {
                            const current = parseInt(watch('suites') || '0');
                            if (!isNaN(current) && current > 0) {
                              setValue('suites', (current - 1).toString());
                            }
                          }}
                        />
                        <RadioGroup 
                          label="Deseja suíte master?" 
                          registration={register('suiteMaster')}
                          options={[{ label: 'Sim', value: 'Sim' }, { label: 'Não', value: 'Não' }]}
                        />
                        <RadioGroup 
                          label="Closet?" 
                          registration={register('closet')}
                          options={[{ label: 'Sim', value: 'Sim' }, { label: 'Não', value: 'Não' }]}
                        />
                        <RadioGroup 
                          label="Varanda?" 
                          registration={register('varanda')}
                          options={[{ label: 'Sim', value: 'Sim' }, { label: 'Não', value: 'Não' }]}
                        />
                        <RadioGroup 
                          label="Sala íntima / TV?" 
                          registration={register('salaIntima')}
                          options={[{ label: 'Sim', value: 'Sim' }, { label: 'Não', value: 'Não' }]}
                        />
                      </div>
                    </div>

                    {/* Complementares */}
                    <div className="bg-gray-50 p-6 rounded-xl border border-gray-100">
                      <h4 className="font-serif text-lg font-medium text-[#1A1A1A] mb-4">🔹 Áreas complementares</h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <RadioGroup label="Lavanderia" registration={register('lavanderia')} options={[{ label: 'Sim', value: 'Sim' }, { label: 'Não', value: 'Não' }]} />
                        <RadioGroup label="Dependência de serviço" registration={register('dependenciaServico')} options={[{ label: 'Sim', value: 'Sim' }, { label: 'Não', value: 'Não' }]} />
                        <RadioGroup label="Depósito" registration={register('deposito')} options={[{ label: 'Sim', value: 'Sim' }, { label: 'Não', value: 'Não' }]} />
                        <RadioGroup label="Academia" registration={register('academia')} options={[{ label: 'Sim', value: 'Sim' }, { label: 'Não', value: 'Não' }]} />
                        <RadioGroup label="Cinema / home theater" registration={register('cinema')} options={[{ label: 'Sim', value: 'Sim' }, { label: 'Não', value: 'Não' }]} />
                        <RadioGroup label="Adega" registration={register('adega')} options={[{ label: 'Sim', value: 'Sim' }, { label: 'Não', value: 'Não' }]} />
                        <RadioGroup label="Spa / sauna" registration={register('spa')} options={[{ label: 'Sim', value: 'Sim' }, { label: 'Não', value: 'Não' }]} />
                        <RadioGroup label="Elevador (alto padrão)" registration={register('elevador')} options={[{ label: 'Sim', value: 'Sim' }, { label: 'Não', value: 'Não' }]} />
                      </div>
                    </div>
                  </div>
                </div>
              </>
            )}

            {/* STEP 4 */}
            {currentStep === 4 && (
              <>
                <div>
                  <SectionTitle>6. Estilo Arquitetônico</SectionTitle>
                  <div className="grid grid-cols-1 gap-6">
                    <ImageRadioGroup 
                      label="Qual estilo arquitetônico mais lhe agrada?" 
                      registration={register('estiloDesejado')}
                      options={[
                        { label: 'Contemporâneo', value: 'Contemporâneo', imageUrl: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=500&q=80' },
                        { label: 'Moderno', value: 'Moderno', imageUrl: 'https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?w=500&q=80' },
                        { label: 'Minimalista', value: 'Minimalista', imageUrl: 'https://images.unsplash.com/photo-1600607687644-aac4c3eac7f4?w=500&q=80' },
                        { label: 'Clássico / Neoclássico', value: 'Clássico', imageUrl: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=500&q=80' },
                        { label: 'Rústico / Fazenda', value: 'Rústico', imageUrl: 'https://images.unsplash.com/photo-1510798831971-661eb04b3739?w=500&q=80' },
                        { label: 'Industrial', value: 'Industrial', imageUrl: 'https://images.unsplash.com/photo-1600585154526-990dced4ea0d?w=500&q=80' },
                      ]}
                    />
                    
                    <div>
                      <label className="block text-sm font-medium text-[#5A5A5A] mb-3">Links de Referência (Instagram, Pinterest, etc.)</label>
                      <div className="space-y-3">
                        <Input placeholder="Link 1 (ex: https://instagram.com/...)" registration={register('referencia1')} />
                        <Input placeholder="Link 2 (ex: https://br.pinterest.com/...)" registration={register('referencia2')} />
                        <Input placeholder="Link 3" registration={register('referencia3')} />
                        <Input placeholder="Link 4" registration={register('referencia4')} />
                        <Input placeholder="Link 5" registration={register('referencia5')} />
                      </div>
                    </div>
                    
                    <div className="md:col-span-1">
                      <FileInput 
                        label="Imagens de Referência (Opcional)" 
                        registration={register('imagensReferencia')} 
                        multiple 
                        accept="image/*"
                        helperText="Envie até 5 fotos de projetos que você gosta. Máx 5MB por arquivo."
                      />
                    </div>
                    
                    <CheckboxGroup 
                      label="Possui alguma preferência por materiais?" 
                      registration={register('materiaisPreferidos')}
                      options={[
                        { label: 'Concreto aparente', value: 'Concreto aparente' },
                        { label: 'Madeira', value: 'Madeira' },
                        { label: 'Vidro', value: 'Vidro' },
                        { label: 'Pedra natural', value: 'Pedra natural' },
                        { label: 'Aço / Metal', value: 'Aço / Metal' },
                        { label: 'Tijolinho', value: 'Tijolinho' },
                      ]}
                    />
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <Input label="Cores preferidas" registration={register('coresPreferidas')} />
                      <Input label="Cores que NÃO gosta" registration={register('coresNaoGosta')} />
                    </div>
                  </div>
                </div>

                <div>
                  <SectionTitle>7. Conforto e Tecnologia</SectionTitle>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <RadioGroup label="Deseja automação residencial?" registration={register('automacao')} options={[{ label: 'Sim', value: 'Sim' }, { label: 'Não', value: 'Não' }]} />
                    <RadioGroup label="Energia solar?" registration={register('energiaSolar')} options={[{ label: 'Sim', value: 'Sim' }, { label: 'Não', value: 'Não' }]} />
                    <RadioGroup label="Sistema de segurança?" registration={register('sistemaSeguranca')} options={[{ label: 'Sim', value: 'Sim' }, { label: 'Não', value: 'Não' }]} />
                    <RadioGroup label="Climatização (ar-condicionado)?" registration={register('climatizacao')} options={[{ label: 'Sim', value: 'Sim' }, { label: 'Não', value: 'Não' }]} />
                    
                    <RadioGroup 
                      label="Aquecimento de água" 
                      registration={register('aquecimentoAgua')}
                      options={[
                        { label: 'Gás', value: 'Gás' },
                        { label: 'Solar', value: 'Solar' },
                      ]}
                    />
                    
                    <RadioGroup 
                      label="Iluminação" 
                      registration={register('iluminacao')}
                      options={[
                        { label: 'Técnica', value: 'Técnica' },
                        { label: 'Decorativa', value: 'Decorativa' },
                        { label: 'Ambas', value: 'Ambas' },
                      ]}
                    />
                  </div>
                </div>
              </>
            )}

            {/* STEP 5 */}
            {currentStep === 5 && (
              <>
                <div>
                  <SectionTitle>8. Estilo de Vida (Essencial para projeto)</SectionTitle>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <RadioGroup label="Costuma receber visitas?" registration={register('recebeVisitas')} options={[{ label: 'Sim', value: 'Sim' }, { label: 'Não', value: 'Não' }]} />
                    
                    <RadioGroup 
                      label="Frequência de eventos" 
                      registration={register('frequenciaEventos')}
                      options={[
                        { label: 'Baixa', value: 'Baixa' },
                        { label: 'Média', value: 'Média' },
                        { label: 'Alta', value: 'Alta' },
                      ]}
                    />
                    
                    <RadioGroup 
                      label="Prefere ambientes" 
                      registration={register('prefereAmbientes')}
                      options={[
                        { label: 'Integrados', value: 'Integrados' },
                        { label: 'Separados', value: 'Separados' },
                      ]}
                    />
                    
                    <RadioGroup label="Trabalha em casa?" registration={register('trabalhaEmCasa')} options={[{ label: 'Sim', value: 'Sim' }, { label: 'Não', value: 'Não' }]} />
                    
                    <div className="md:col-span-2">
                      <RadioGroup 
                        label="Prioriza" 
                        registration={register('prioriza')}
                        options={[
                          { label: 'Conforto', value: 'Conforto' },
                          { label: 'Estética', value: 'Estética' },
                          { label: 'Funcionalidade', value: 'Funcionalidade' },
                          { label: 'Luxo', value: 'Luxo' },
                        ]}
                      />
                    </div>
                  </div>
                </div>

                <div>
                  <SectionTitle>9. Área Externa</SectionTitle>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <RadioGroup label="Piscina" registration={register('piscinaExterna')} options={[{ label: 'Sim', value: 'Sim' }, { label: 'Não', value: 'Não' }]} />
                    <RadioGroup label="Churrasqueira / gourmet?" registration={register('churrasqueira')} options={[{ label: 'Sim', value: 'Sim' }, { label: 'Não', value: 'Não' }]} />
                    <RadioGroup label="Jardim" registration={register('jardim')} options={[{ label: 'Sim', value: 'Sim' }, { label: 'Não', value: 'Não' }]} />
                    <RadioGroup label="Espaço kids?" registration={register('espacoKids')} options={[{ label: 'Sim', value: 'Sim' }, { label: 'Não', value: 'Não' }]} />
                    <RadioGroup label="Área pet?" registration={register('areaPet')} options={[{ label: 'Sim', value: 'Sim' }, { label: 'Não', value: 'Não' }]} />
                    <RadioGroup label="Deck / varanda?" registration={register('deckVaranda')} options={[{ label: 'Sim', value: 'Sim' }, { label: 'Não', value: 'Não' }]} />
                  </div>
                </div>
              </>
            )}

            {/* STEP 6 */}
            {currentStep === 6 && (
              <>
                <div>
                  <SectionTitle>10. Orçamento (Muito Importante)</SectionTitle>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="md:col-span-2">
                      <CurrencyInput 
                        label="Valor previsto para obra" 
                        registration={register('valorPrevisto')} 
                        placeholder="R$ 0,00"
                        intlConfig={{ locale: 'pt-BR', currency: 'BRL' }}
                        allowDecimals={true}
                        decimalsLimit={2}
                      />
                    </div>
                    
                    <RadioGroup 
                      label="Nível desejado" 
                      registration={register('nivelDesejado')}
                      options={[
                        { label: 'Médio padrão', value: 'Médio padrão' },
                        { label: 'Alto padrão', value: 'Alto padrão' },
                        { label: 'Luxo', value: 'Luxo' },
                      ]}
                    />
                    
                    <RadioGroup 
                      label="Flexibilidade de investimento" 
                      registration={register('flexibilidade')}
                      options={[
                        { label: 'Baixa', value: 'Baixa' },
                        { label: 'Média', value: 'Média' },
                        { label: 'Alta', value: 'Alta' },
                      ]}
                    />
                  </div>
                </div>

                <div>
                  <SectionTitle>11. Prazos</SectionTitle>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <Input label="Quando deseja iniciar o projeto?" registration={register('inicioProjeto')} />
                    <Input label="Quando deseja iniciar a obra?" registration={register('inicioObra')} />
                    <Input label="Quando deseja concluir?" registration={register('conclusao')} />
                  </div>
                </div>
              </>
            )}

            {/* STEP 7 */}
            {currentStep === 7 && (
              <>
                <div>
                  <SectionTitle>12. Expectativas</SectionTitle>
                  <div className="grid grid-cols-1 gap-6">
                    <Textarea label="O que NÃO pode faltar no projeto?" registration={register('naoPodeFaltar')} />
                    <Textarea label="O que seria um “projeto perfeito” para você?" registration={register('projetoPerfeito')} />
                    <Textarea label="Alguma necessidade específica?" registration={register('necessidadeEspecifica')} />
                    <Textarea label="Alguma restrição?" registration={register('restricao')} />
                  </div>
                </div>

                <div>
                  <SectionTitle>13. Documentos</SectionTitle>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <RadioGroup label="Possui matrícula do terreno?" registration={register('matricula')} options={[{ label: 'Sim', value: 'Sim' }, { label: 'Não', value: 'Não' }]} />
                    <RadioGroup label="Possui escritura?" registration={register('escritura')} options={[{ label: 'Sim', value: 'Sim' }, { label: 'Não', value: 'Não' }]} />
                    <RadioGroup label="Possui levantamento planialtimétrico?" registration={register('planialtimetrico')} options={[{ label: 'Sim', value: 'Sim' }, { label: 'Não', value: 'Não' }]} />
                    <RadioGroup label="Possui projeto anterior?" registration={register('projetoAnterior')} options={[{ label: 'Sim', value: 'Sim' }, { label: 'Não', value: 'Não' }]} />
                    
                    <div className="md:col-span-2 mt-2">
                      <FileInput 
                        label="Anexar Documentos (Plantas, Matrícula, Projetos Anteriores)" 
                        registration={register('arquivosDocumentos')} 
                        multiple 
                        accept=".pdf,.dwg,.doc,.docx,image/*"
                        helperText="Formatos aceitos: PDF, DWG, DOC, Imagens. Máx 5MB por arquivo."
                      />
                    </div>
                  </div>
                </div>

                <div>
                  <SectionTitle>14. Observações Finais</SectionTitle>
                  <div className="grid grid-cols-1 gap-6">
                    <Textarea label="Espaço livre para escrever" registration={register('observacoes')} placeholder="Deixe aqui qualquer comentário adicional..." />
                  </div>
                </div>

                <div className="mt-12 bg-[#F8F7F5] p-8 rounded-2xl border border-gray-100">
                  <h3 className="text-xl font-serif font-medium text-[#1A1A1A] mb-4 flex items-center gap-3">
                    <span className="text-2xl">✨</span> Para finalizar
                  </h3>
                  <Textarea 
                    label="Por que você escolheu nosso escritório?" 
                    registration={register('porqueEscolheu')} 
                    placeholder="Sua resposta é muito importante para nós..."
                    className="bg-white"
                  />
                </div>
              </>
            )}
          </motion.div>
        </AnimatePresence>

        {/* Navigation Buttons */}
        <div className="flex items-center justify-between pt-10 mt-10 border-t border-gray-100">
          <button
            type="button"
            onClick={prevStep}
            disabled={currentStep === 1 || isSubmitting}
            className="flex items-center px-6 py-3.5 text-sm font-medium text-[#5A5A5A] bg-white border border-gray-200 rounded-full hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#1A1A1A] disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
          >
            <ChevronLeft className="w-4 h-4 mr-2" />
            Voltar
          </button>

          {currentStep < STEPS.length ? (
            <button
              type="button"
              onClick={nextStep}
              className="flex items-center px-8 py-3.5 text-sm font-medium text-white bg-[#1A1A1A] border border-transparent rounded-full hover:bg-[#333333] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#1A1A1A] transition-all duration-200 shadow-sm"
            >
              Próximo
              <ChevronRight className="w-4 h-4 ml-2" />
            </button>
          ) : (
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex items-center px-8 py-3.5 text-sm font-medium text-white bg-[#1A1A1A] border border-transparent rounded-full hover:bg-[#333333] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#1A1A1A] disabled:opacity-70 disabled:cursor-not-allowed transition-all duration-200 shadow-md"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                  Enviando...
                </>
              ) : (
                <>
                  <CheckCircle2 className="w-5 h-5 mr-2" />
                  Finalizar Briefing
                </>
              )}
            </button>
          )}
        </div>
      </form>
    </div>
  );
}
