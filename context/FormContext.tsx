import React, { createContext, useContext, useState } from 'react';

interface FormContextType {
  formData: Record<string, any>;
  updateFormData: (step: string, data: any) => void;
  resetFormData: () => void;
}

const FormContext = createContext<FormContextType | undefined>(undefined);

export const FormProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const initialFormData = {
    paso1_1: {},
    paso1_2: {},
    paso1_3: {},
    paso1_4: {},
    paso1_5: {},
    paso1_6: {},
    paso1_7: {},
  };

  const [formData, setFormData] = useState(initialFormData);

  const updateFormData = (step: string, data: any) => {
    setFormData(prev => ({ ...prev, [step]: data }));
  };

  const resetFormData = () => {
    setFormData(initialFormData);
  };

  return (
    <FormContext.Provider value={{ formData, updateFormData, resetFormData }}>
      {children}
    </FormContext.Provider>
  );
};

export const useForm = () => {
  const context = useContext(FormContext);
  if (!context) throw new Error('useForm debe usarse dentro de un FormProvider');
  return context;
};