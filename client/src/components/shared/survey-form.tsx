'use client';

import { useEffect, useState } from 'react';
import { Model } from 'survey-core';
import { Survey } from 'survey-react-ui';
// import 'survey-core/defaultV2.min.css';

interface SurveyFormProps {
  schema: any;
  data?: any;
  onComplete: (result: any) => void;
  onValueChanged?: (result: any) => void;
}

export function SurveyForm({ schema, data, onComplete, onValueChanged }: SurveyFormProps) {
  const [survey, setSurvey] = useState<Model | null>(null);

  useEffect(() => {
    // Dynamically import SurveyJS to avoid SSR issues
    const initializeSurvey = async () => {
      try {
        const { Model } = await import('survey-core');
        
        const surveyModel = new Model(schema);
        
        // Set initial data if provided
        if (data) {
          surveyModel.data = data;
        }

        // Configure survey appearance
        surveyModel.applyTheme({
          "cssVariables": {
            "--sjs-corner-radius": "6px",
            "--sjs-primary-foreground": "255, 255, 255",
            "--sjs-primary-background": "37, 99, 235",
            "--sjs-primary-background-light": "219, 234, 254",
            "--sjs-secondary-background": "248, 250, 252",
            "--sjs-secondary-background-75": "248, 250, 252, 0.75",
            "--sjs-general-backcolor": "255, 255, 255",
            "--sjs-general-forecolor": "15, 23, 42",
            "--sjs-general-forecolor-light": "100, 116, 139",
            "--sjs-general-dim-forecolor": "148, 163, 184",
            "--sjs-general-dim-forecolor-light": "203, 213, 225"
          }
        });

        // Event handlers
        surveyModel.onComplete.add((sender) => {
          onComplete(sender.data);
        });

        if (onValueChanged) {
          surveyModel.onValueChanged.add((sender) => {
            onValueChanged(sender.data);
          });
        }

        setSurvey(surveyModel);
      } catch (error) {
        console.error('Failed to initialize survey:', error);
      }
    };

    initializeSurvey();
  }, [schema, data, onComplete, onValueChanged]);

  // Fallback form component for when SurveyJS is not available
  const FallbackForm = () => (
    <div className="space-y-4 p-4 border rounded-lg">
      <h3 className="text-lg font-semibold">Form</h3>
      <p className="text-gray-600">SurveyJS is loading...</p>
      <div className="animate-pulse space-y-3">
        <div className="h-4 bg-gray-200 rounded w-3/4"></div>
        <div className="h-10 bg-gray-200 rounded"></div>
        <div className="h-4 bg-gray-200 rounded w-1/2"></div>
        <div className="h-10 bg-gray-200 rounded"></div>
      </div>
    </div>
  );

  if (!survey) return <FallbackForm />;

  return (
    <div className="survey-container">
      <Survey model={survey} />
    </div>
  );
}