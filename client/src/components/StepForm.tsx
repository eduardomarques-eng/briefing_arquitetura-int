import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { CheckCircle2, ChevronRight, AlertCircle, Loader2, X } from 'lucide-react';
import { toast } from 'sonner';

interface FormData {
  objective: string;
  phase: string;
  timeline: string;
  clientName: string;
  clientPhone: string;
  clientEmail: string;
  clientCity: string;
  clientProfession: string;
  hasLand: string;
  landArea: string;
  topography: string;
  solarOrientation: string;
  naturalVentilation: string;
  landRestrictions: string[];
  familyMembers: string;
  hasChildren: string;
  hasPets: string;
  worksFromHome: string;
  homeOfficeNeeds: string;
  visitFrequency: string;
  architecturalStyle: string;
  visualReferences: string;
  customizationLevel: string;
  bedrooms: string;
  bathrooms: string;
  suites: string;
  extraRooms: string[];
  garageSpots: string;
  climateControl: string;
  homeAutomation: string;
  acousticIsolation: string;
  budget: string;
  budgetFlexibility: string;
  startDeadline: string;
  completionDeadline: string;
  mainPriority: string;
  undesiredFeatures: string;
  dreamProject: string;
  wantsMeeting: string;
}

interface FormErrors {
  [key: string]: string;
}

const STEPS = [
  { id: 1, title: 'Qualificação', icon: '📋' },
  { id: 2, title: 'Contato', icon: '👤' },
  { id: 3, title: 'Terreno', icon: '🏗️' },
  { id: 4, title: 'Família', icon: '👨‍👩‍👧‍👦' },
  { id: 5, title: 'Estilo', icon: '🎨' },
  { id: 6, title: 'Necessidades', icon: '🏠' },
  { id: 7, title: 'Conforto', icon: '🌡️' },
  { id: 8, title: 'Orçamento', icon: '💰' },
  { id: 9, title: 'Prioridades', icon: '✨' },
];

const REQUIRED_FIELDS: Record<number, string[]> = {
  1: ['objective', 'phase', 'timeline'],
  2: ['clientName', 'clientPhone', 'clientEmail', 'clientCity'],
  3: ['hasLand'],
  4: ['familyMembers', 'hasChildren'],
  5: ['architecturalStyle'],
  6: ['bedrooms', 'bathrooms', 'suites'],
  7: ['climateControl'],
  8: ['budget'],
  9: ['dreamProject', 'wantsMeeting'],
};

const FormContext = React.createContext<any>(null);

const FormField: React.FC<{ 
  label: string; 
  type?: string; 
  field: string; 
  placeholder?: string; 
  required?: boolean;
  options?: string[];
  helpText?: string;
  condition?: boolean;
}> = ({ label, type = 'text', field, placeholder, required = false, options, helpText, condition }) => {
  if (condition === false) return null;

  const { formData, handleInputChange, errors, touchedFields, setTouchedFields } = React.useContext(FormContext);
  const hasError = errors[field] && touchedFields.has(field);
  const value = formData[field as keyof FormData];
  
  return (
    <div className="mb-6">
      <label className="form-label">
        {label}
        {required && <span className="text-destructive ml-1">*</span>}
      </label>
      {type === 'checkbox-group' && options ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-2">
          {options.map(opt => {
            const currentArr = (value as string[]) || [];
            const isChecked = currentArr.includes(opt);
            return (
              <label key={opt} className="flex items-center space-x-3 cursor-pointer p-2 rounded-lg hover:bg-secondary/50 transition-colors">
                <input 
                  type="checkbox"
                  className="w-5 h-5 rounded border-secondary text-primary focus:ring-primary shadow-sm"
                  checked={isChecked}
                  onChange={(e) => {
                    let newArr = [...currentArr];
                    if (e.target.checked) {
                      if (opt === 'Nenhuma') newArr = ['Nenhuma'];
                      else {
                        newArr = newArr.filter(item => item !== 'Nenhuma');
                        newArr.push(opt);
                      }
                    } else {
                      newArr = newArr.filter(item => item !== opt);
                    }
                    handleInputChange(field, newArr);
                  }}
                />
                <span className="text-secondary-foreground font-medium text-sm">{opt}</span>
              </label>
            );
          })}
        </div>
      ) : options ? (
        <select
          className={`form-select ${hasError ? 'border-destructive' : ''}`}
          value={value as string}
          onChange={(e) => handleInputChange(field, e.target.value)}
          onBlur={() => setTouchedFields((prev: Set<string>) => new Set(prev).add(field))}
        >
          <option value="">Selecione uma opção</option>
          {options.map(opt => (
            <option key={opt} value={opt}>{opt}</option>
          ))}
        </select>
      ) : type === 'textarea' ? (
        <textarea
          className={`form-textarea ${hasError ? 'border-destructive' : ''}`}
          placeholder={placeholder}
          rows={4}
          value={value as string}
          onChange={(e) => handleInputChange(field, e.target.value)}
          onBlur={() => setTouchedFields((prev: Set<string>) => new Set(prev).add(field))}
        />
      ) : (
        <input
          type={type}
          className={`form-input ${hasError ? 'border-destructive' : ''}`}
          placeholder={placeholder}
          value={value as string}
          onChange={(e) => handleInputChange(field, e.target.value)}
          onBlur={() => setTouchedFields((prev: Set<string>) => new Set(prev).add(field))}
        />
      )}
      {helpText && !hasError && (
        <p className="text-xs text-muted-foreground mt-2">{helpText}</p>
      )}
      {hasError && (
        <div className="flex items-center gap-2 mt-2 text-destructive text-sm font-medium">
          <AlertCircle className="w-4 h-4 flex-shrink-0" />
          <span>{errors[field]}</span>
        </div>
      )}
    </div>
  );
};


export const StepForm: React.FC = () => {
  const [currentStep, setCurrentStep] = useState(1);

  const defaultValues: FormData = {
    objective: 'Construir para morar',
    phase: 'Apenas pesquisando ideias',
    timeline: 'Ainda sem previsão',
    clientName: '',
    clientPhone: '',
    clientEmail: '',
    clientCity: '',
    clientProfession: '',
    hasLand: 'Não',
    landArea: '',
    topography: 'Plano',
    solarOrientation: 'Não sei',
    naturalVentilation: 'Não sei',
    landRestrictions: [],
    familyMembers: '2',
    hasChildren: 'Não',
    hasPets: 'Não',
    worksFromHome: 'Não',
    homeOfficeNeeds: 'Não',
    visitFrequency: 'Ocasionalmente',
    architecturalStyle: 'Contemporâneo',
    visualReferences: '',
    customizationLevel: 'Equilibrado',
    bedrooms: '3',
    bathrooms: '2',
    suites: '1',
    extraRooms: [],
    garageSpots: '2',
    climateControl: 'Ar-condicionado',
    homeAutomation: 'Não',
    acousticIsolation: 'Não',
    budget: 'Até R$ 500 mil',
    budgetFlexibility: 'Sim',
    startDeadline: 'Ainda sem previsão',
    completionDeadline: 'Ainda sem previsão',
    mainPriority: 'Conforto',
    undesiredFeatures: '',
    dreamProject: '',
    wantsMeeting: 'Sim',
  };

  const [formData, setFormData] = useState<FormData>(defaultValues);
  const [errors, setErrors] = useState<FormErrors>({});
  const [completedSteps, setCompletedSteps] = useState<number[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [touchedFields, setTouchedFields] = useState<Set<string>>(new Set());

  useEffect(() => {
    const saved = localStorage.getItem('briefingFormData');
    if (saved) {
      try {
        const parsedData = JSON.parse(saved);
        setFormData({ ...defaultValues, ...parsedData });
      } catch (e) {
        console.error('Error loading saved form data:', e);
      }
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('briefingFormData', JSON.stringify(formData));
  }, [formData]);

  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validatePhone = (phone: string): boolean => {
    const digits = phone.replace(/\D/g, '');
    return digits.length >= 10;
  };

  const formatPhone = (value: string): string => {
    const digits = value.replace(/\D/g, '');
    if (digits.length <= 2) return digits;
    if (digits.length <= 6) return `(${digits.slice(0, 2)}) ${digits.slice(2)}`;
    return `(${digits.slice(0, 2)}) ${digits.slice(2, 7)}-${digits.slice(7, 11)}`;
  };

  const validateStep = (step: number): boolean => {
    const stepErrors: FormErrors = {};
    const requiredFields = REQUIRED_FIELDS[step];

    requiredFields.forEach(field => {
      const value = formData[field as keyof FormData];
      if (Array.isArray(value)) {
         if (value.length === 0) stepErrors[field] = 'Selecione ao menos uma opção';
      } else if (!value || value.toString().trim() === '') {
        stepErrors[field] = 'Campo obrigatório';
      }
    });

    if (step === 2 && formData.clientEmail) {
      if (!validateEmail(formData.clientEmail)) {
        stepErrors.clientEmail = 'Email inválido';
      }
    }

    if (step === 2 && formData.clientPhone) {
      if (!validatePhone(formData.clientPhone)) {
        stepErrors.clientPhone = 'Telefone inválido (mínimo 10 dígitos)';
      }
    }

    setErrors(stepErrors);
    return Object.keys(stepErrors).length === 0;
  };

  const handleInputChange = (field: string, value: string | string[]) => {
    if (field === 'clientPhone' && typeof value === 'string') {
      value = formatPhone(value);
    }

    setFormData(prev => ({
      ...prev,
      [field]: value
    }));

    setTouchedFields(prev => new Set(prev).add(field));

    if (errors[field]) {
      const newErrors = { ...errors };
      delete newErrors[field];
      setErrors(newErrors);
    }
  };

  const handleStepClick = (step: number) => {
    if (step === currentStep) return;
    if (step < currentStep || completedSteps.includes(step)) {
      setCurrentStep(step);
    }
  };

  const handleNext = () => {
    if (validateStep(currentStep)) {
      if (!completedSteps.includes(currentStep)) {
        setCompletedSteps([...completedSteps, currentStep]);
      }
      if (currentStep < STEPS.length) {
        window.scrollTo({ top: 0, behavior: 'smooth' });
        setCurrentStep(currentStep + 1);
      }
    }
  };

  const handlePrevious = () => {
    if (currentStep > 1) {
      window.scrollTo({ top: 0, behavior: 'smooth' });
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSubmit = async () => {
    if (validateStep(currentStep)) {
      setIsSubmitting(true);
      try {
        const response = await fetch('/api/send-email', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(formData)
        });
        
        const result = await response.json();
        
        if (!response.ok) {
          throw new Error(result.message || 'Erro ao enviar formulário');
        }
        
        toast.success(result.message || 'Recebemos suas informações. Entraremos em contato em breve.');
        
        setTimeout(() => {
          setFormData(defaultValues);
          setCurrentStep(1);
          setCompletedSteps([]);
          setTouchedFields(new Set());
          localStorage.removeItem('briefingFormData');
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }, 2000);
      } catch (error: any) {
        toast.error(error.message || 'Erro ao enviar formulário. Tente novamente.');
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  return (
    <FormContext.Provider value={{ formData, handleInputChange, errors, touchedFields, setTouchedFields }}>
    <div className="w-full">
      {/* Tabs */}
      <div className="mb-8 overflow-x-auto pb-2 scrollbar-hide">
        <div className="flex gap-2 w-max px-1">
          {STEPS.map((step) => (
            <button
              key={step.id}
              onClick={() => handleStepClick(step.id)}
              disabled={step.id > currentStep && !completedSteps.includes(step.id)}
              className={`flex items-center gap-2 px-4 py-3 rounded-lg transition-all duration-300 font-medium text-sm whitespace-nowrap ${
                step.id === currentStep
                  ? 'bg-primary text-primary-foreground shadow-md scale-105 origin-left'
                  : completedSteps.includes(step.id)
                  ? 'bg-accent text-accent-foreground cursor-pointer hover:shadow-md'
                  : 'bg-secondary text-secondary-foreground cursor-not-allowed opacity-50'
              }`}
            >
               <span className="text-lg">{step.icon}</span>
              <span className="hidden sm:inline sm:text-sm text-xs">{step.title}</span>
              {completedSteps.includes(step.id) && step.id !== currentStep && (
                <CheckCircle2 className="w-4 h-4 ml-1 text-green-500" />
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Progress Bar */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-2xl font-bold text-foreground">
            {STEPS[currentStep - 1].title}
          </h2>
          <span className="text-sm text-muted-foreground font-medium">
            {currentStep}/{STEPS.length}
          </span>
        </div>
        
        <div className="w-full h-2 bg-secondary rounded-full overflow-hidden">
          <div
            className="h-full bg-primary transition-all duration-500"
            style={{ width: `${(currentStep / STEPS.length) * 100}%` }}
          />
        </div>
      </div>

      {/* Form Content */}
      <div className="mb-8 animate-fade-in-up">
        {/* Step 1: Qualificação */}
        {currentStep === 1 && (
          <div className="space-y-4">
            <FormField 
              label="Qual o seu objetivo com este projeto?" 
              field="objective" 
              required 
              options={['Construir para morar', 'Investimento', 'Casa de veraneio', 'Outro']} 
            />
            <FormField 
              label="Em que fase você está?" 
              field="phase" 
              required 
              options={['Apenas pesquisando ideias', 'Já tenho terreno', 'Pretendo construir em breve', 'Pronto para iniciar projeto']} 
            />
            <FormField 
              label="Quando pretende iniciar?" 
              field="timeline" 
              required 
              options={['Imediatamente', 'Em até 3 meses', '3 a 6 meses', 'Ainda sem previsão']} 
            />
          </div>
        )}

        {/* Step 2: Dados Pessoais */}
        {currentStep === 2 && (
          <div className="space-y-4">
            <FormField label="Nome completo" field="clientName" required placeholder="João Silva" />
            <FormField 
              label="Telefone (WhatsApp)" 
              field="clientPhone" 
              type="tel" 
              required 
              placeholder="(11) 99999-9999"
              helpText="Será usado para contato direto"
            />
            <FormField label="E-mail" field="clientEmail" type="email" required placeholder="seu@email.com" />
            <FormField label="Cidade/Estado" field="clientCity" required placeholder="São Paulo, SP" />
            <FormField label="Profissão" field="clientProfession" placeholder="Sua profissão (opcional)" />
          </div>
        )}

        {/* Step 3: Terreno */}
        {currentStep === 3 && (
          <div className="space-y-4">
            <FormField 
              label="Possui terreno?" 
              field="hasLand" 
              required 
              options={['Sim', 'Não']} 
            />
            <FormField 
              label="Área total do terreno (m²)" 
              field="landArea" 
              type="number" 
              placeholder="Ex: 500"
              helpText="Deixe em branco se ainda não possui proporções do terreno"
            />
            <FormField 
              label="Topografia" 
              field="topography" 
              options={['Plano', 'Aclive', 'Declive', 'Não sei']} 
            />
            <FormField 
              label="Orientação solar" 
              field="solarOrientation" 
              options={['Sim (Já mapeada)', 'Não analisada', 'Não sei o que é']} 
            />
            <FormField 
              label="Ventilação natural do local" 
              field="naturalVentilation" 
              options={['Boa', 'Média', 'Ruim', 'Não sei']} 
            />
            <FormField 
              label="Restrições do terreno / bairro" 
              field="landRestrictions" 
              type="checkbox-group"
              options={['Condomínio', 'Prefeitura (Gabaritos rígidos)', 'Área de preservação', 'Nenhuma restrição aparente', 'Outro']} 
            />
          </div>
        )}

        {/* Step 4: Família */}
        {currentStep === 4 && (
          <div className="space-y-4">
            <FormField 
              label="Quantas pessoas irão morar?" 
              field="familyMembers" 
              type="number" 
              required 
              placeholder="4"
              helpText="Incluindo você"
            />
            <FormField 
              label="Possui crianças?" 
              field="hasChildren" 
              required 
              options={['Sim', 'Não']} 
            />
            <FormField 
              label="Possui pets?" 
              field="hasPets" 
              options={['Sim, cachorros', 'Sim, gatos', 'Outros pets', 'Não possuem']} 
            />
            <FormField 
              label="Alguém da família trabalha em casa?" 
              field="worksFromHome" 
              options={['Sim, 100% Home Office', 'Sim, modelo Híbrido', 'Não']} 
            />
            <FormField 
              label="Necessidade de espaço de Home Office dedicado?" 
              field="homeOfficeNeeds" 
              options={['Sim, escritório isolado', 'Sim, integrado a outro ambiente', 'Não, faço na mesa de jantar/quarto', 'Não preciso']} 
            />
            <FormField 
              label="Frequência de recepcionar visitas/eventos" 
              field="visitFrequency" 
              options={['Raramente', 'Ocasionalmente (pequenos grupos)', 'Frequentemente (Adoro receber gente!)']} 
            />
          </div>
        )}

        {/* Step 5: Estilo e Referências */}
        {currentStep === 5 && (
          <div className="space-y-4">
            <FormField 
              label="Qual estilo arquitetônico mais lhe atrai?" 
              field="architecturalStyle" 
              options={['Moderno (Linhas retas, vãos livres)', 'Contemporâneo (Última tendência)', 'Clássico / Neoclássico', 'Minimalista (Menos é mais)', 'Industrial (Aço, tijolo aparente)', 'Rústico / Fazenda', 'Não tenho certeza / Outro']} 
              required
            />
            <FormField 
              label="Links ou imagens de referência (Pinterest, Instagram)" 
              field="visualReferences" 
              type="textarea"
              placeholder="Cole os links de inspiração aqui para facilitar o nosso alinhamento visual..." 
            />
            <FormField 
              label="Nível de personalização desejado" 
              field="customizationLevel" 
              options={['Econômico e prático (padrão)', 'Equilibrado (alguns toques luxuosos)', 'Alto padrão / Exclusivo (Design assinado)']} 
            />
          </div>
        )}

        {/* Step 6: Necessidades */}
        {currentStep === 6 && (
          <div className="space-y-4">
            <FormField 
              label="Quantidade total de dormitórios" 
              field="bedrooms" 
              type="number" 
              required 
              placeholder="Ex: 3"
            />
             <FormField 
              label="Quantos desses dormitórios serão suítes?" 
              field="suites" 
              type="number" 
              required 
              placeholder="Ex: 1"
            />
            <FormField 
              label="Quantidade total de banheiros (incluindo lavabos)" 
              field="bathrooms" 
              type="number" 
              required 
              placeholder="Ex: 2"
            />
            <FormField 
              label="Quais ambientes extras a casa DEVE ter?" 
              field="extraRooms" 
              type="checkbox-group"
              options={['Closet', 'Lavabo', 'Área Gourmet / Churrasqueira', 'Piscina / Ofurô', 'Lavanderia Coberta Separada', 'Depósito / Dispensa', 'Garagem Coberta']} 
            />
            <FormField 
              label="Quantidade de vagas de garagem coberta" 
              field="garageSpots" 
              type="number"
              placeholder="Ex: 2"
              condition={formData.extraRooms.includes('Garagem Coberta')}
            />
          </div>
        )}

        {/* Step 7: Conforto e Tecnologia */}
        {currentStep === 7 && (
          <div className="space-y-4">
            <FormField 
              label="Preferência de Climatização" 
              field="climateControl" 
              options={['Previsão para Ar-condicionado em tudo', 'Apenas Ar-condicionado nos quartos', 'Sistemas passivos / Ventilação natural', 'Ambos']} 
              required
            />
            <FormField 
              label="Planeja Automação Residencial (Sistemas Inteligentes)?" 
              field="homeAutomation" 
              options={['Sim, automação completa', 'Apenas itens básicos (Câmeras, Fechaduras)', 'Não por enquanto', 'Não tenho interesse']} 
            />
            <FormField 
              label="Necessidade vital de isolamento acústico?" 
              field="acousticIsolation" 
              options={['Sim (Região barulhenta / Estúdio em casa)', 'Moderada', 'Não me preocupo com isso']} 
            />
          </div>
        )}

        {/* Step 8: Orçamento */}
        {currentStep === 8 && (
          <div className="space-y-4">
            <FormField 
              label="Orçamento previsto para a obra / reforma" 
              field="budget" 
              required 
              options={['Até R$ 500 mil', 'R$ 500 mil a R$ 1 milhão', 'R$ 1M a R$ 2M', 'Acima de R$ 2M']} 
            />
            <FormField 
              label="Como está a flexibilidade desse orçamento?" 
              field="budgetFlexibility" 
              options={['Altamente flexível, pode subir um pouco', 'Margem pequena de contingência', 'Arrojado. Não pode estourar o teto.']} 
            />
            <FormField 
              label="Qual é o seu prazo MÁXIMO aceitável para o início das obras?" 
              field="startDeadline" 
              options={['Imediato (pra ontem!)', 'Dentro de 6 meses', 'Daqui a 1 ano', 'Ainda sem previsão, não tenho pressa']} 
            />
            <FormField 
              label="Prazo desejado para mudar / conclusão da obra" 
              field="completionDeadline" 
              options={['O mais rápido humanamente possível', 'Menos de 1 ano', '1 ano e meio a 2 anos', 'A construção ditará o ritmo']} 
            />
          </div>
        )}

        {/* Step 9: Prioridades */}
        {currentStep === 9 && (
          <div className="space-y-4">
            <FormField 
              label="Entre as opções abaixo, qual é INEGOCIÁVEL para você?" 
              field="mainPriority" 
              options={['Estética deslumbrante e Design Arquitetônico', 'Custo-benefício extremo (Ficar no orçamento)', 'Conforto Absoluto e Funcionalidade Prática', 'Rapidez na entrega final da obra']} 
            />
            <FormField 
              label="O que você NÃO deseja no seu projeto de jeito nenhum?" 
              field="undesiredFeatures" 
              type="textarea"
              placeholder="Ex: Escadas difíceis, janelas pequenas, estilo rebuscado, corredores longos..." 
            />
            <FormField 
              label="Para finalizar: Descreva o projeto dos seus sonhos" 
              field="dreamProject" 
              type="textarea" 
              required 
              placeholder="Nos conte tudo o que você sempre imaginou para esse espaço... Sem filtros."
              helpText="Ao clicar em Enviar, nossa arquitetura avaliará todo seu escopo a fundo!"
            />
          </div>
        )}
      </div>

      {/* Navigation Buttons */}
      <div className="flex gap-3 justify-between">
        <Button
          onClick={handlePrevious}
          disabled={currentStep === 1}
          variant="outline"
          className="flex-1 py-3 text-base font-semibold"
        >
          Voltar
        </Button>

        {currentStep === STEPS.length ? (
          <Button
            onClick={handleSubmit}
            disabled={isSubmitting}
            className="flex-1 btn-primary py-3 text-base font-semibold flex items-center justify-center gap-2"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Processando...
              </>
            ) : (
              'Enviar Relatório Final'
            )}
          </Button>
        ) : (
          <Button
            onClick={handleNext}
            className="flex-1 btn-primary py-3 text-base font-semibold flex items-center justify-center gap-2"
          >
            Próximo <ChevronRight className="w-4 h-4" />
          </Button>
        )}
      </div>

      {/* Form Completion Indicator */}
      {completedSteps.length > 0 && (
        <div className="mt-6 text-center text-sm text-muted-foreground">
          Progresso: {completedSteps.length} de {STEPS.length} etapas cumpridas
        </div>
      )}
    </div>
    </FormContext.Provider>
  );
};
