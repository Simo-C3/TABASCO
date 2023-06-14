import React, { useEffect, useRef } from 'react';

type PropsType = {
  onChange: ({ isEnabled, format, language }: { isEnabled: boolean; format: string; language: string }) => void;
};

const Summary = ({ onChange }: PropsType) => {
  const isEnabledRef = useRef<HTMLInputElement>(null);
  const configRef = useRef<HTMLDivElement>(null);
  const formatRef = useRef<HTMLSelectElement>(null);
  const languageRef = useRef<HTMLSelectElement>(null);

  let isEnabled = false;
  let format = 'default';
  let language = 'jp';

  const handleChangeIsEnabled = (e: Event) => {
    isEnabled = (e.target as HTMLInputElement).checked;
    onChange({ isEnabled, format, language });

    if (isEnabled) {
      configRef.current?.classList.remove('hidden');
    } else {
      configRef.current?.classList.add('hidden');
    }
  };

  const handleChangeFormat = (e: Event) => {
    format = (e.target as HTMLSelectElement).value;
    onChange({ isEnabled, format, language });
  };

  const handleChangeLanguage = (e: Event) => {
    language = (e.target as HTMLSelectElement).value;
    onChange({ isEnabled, format, language });
  };

  useEffect(() => {
    isEnabledRef.current?.addEventListener('change', handleChangeIsEnabled);
    formatRef.current?.addEventListener('change', handleChangeFormat);
    languageRef.current?.addEventListener('change', handleChangeLanguage);

    return () => {
      isEnabledRef.current?.removeEventListener('change', handleChangeIsEnabled);
      formatRef.current?.removeEventListener('change', handleChangeFormat);
      languageRef.current?.removeEventListener('change', handleChangeLanguage);
    };
  }, []);

  return (
    <>
      <div className='mt-3 flex items-center py-1 pl-0 text-base'>
        <input ref={isEnabledRef} id='summary-input' type='checkbox' className='mx-3' />
        <span>要約</span>
      </div>
      <div ref={configRef} className='my-1 hidden pl-14 text-sm'>
        <div className='mb-2 flex items-center justify-between'>
          <span>フォーマット</span>
          <select ref={formatRef} name='format' id='summary-format-select'>
            <option value='default'>標準</option>
            <option value='list'>リスト</option>
          </select>
        </div>
        <div className='flex items-center justify-between'>
          <span>翻訳</span>
          <select ref={languageRef} name='language' id='summary-language-select'>
            <option value='jp'>日本語</option>
            <option value='en'>英語</option>
          </select>
        </div>
      </div>
    </>
  );
};

export default Summary;
