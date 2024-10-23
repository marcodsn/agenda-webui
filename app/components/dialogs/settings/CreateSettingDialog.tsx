import React, { useState } from 'react';
import * as Dialog from '@radix-ui/react-dialog';
import styles from '../DialogStyle.module.css';
import { CreateSettingDto, settingsApi } from '../../../api/settingsApi';

interface CreateSettingDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSettingCreated: (setting: CreateSettingDto) => void;
}

const CreateSettingDialog: React.FC<CreateSettingDialogProps> = ({
  isOpen,
  onClose,
  onSettingCreated,
}) => {
  const [settingData, setSettingData] = useState<CreateSettingDto>({
    key: '',
    value: '',
  });
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setSettingData((prev: CreateSettingDto) => ({
      ...prev,
      [name]: value,
    }));
  };

  const validateSetting = (setting: CreateSettingDto): string | null => {
    if (!setting.key) return "Key is required";
    if (!setting.value) return "Value is required";
    return null;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const error = validateSetting(settingData);
      if (error) {
        setErrorMessage(error);
        return;
      }
      const setting = await settingsApi.create(settingData);
      onSettingCreated(setting);
      onClose();
    } catch (error) {
      console.error('Error creating setting:', error);
      setErrorMessage('An error occurred while creating the setting');
    }
  };

  return (
    <Dialog.Root open={isOpen} onOpenChange={onClose}>
      <Dialog.Portal>
        <Dialog.Overlay className={styles.dialogOverlay} />
        <Dialog.Content className={styles.dialogContent}>
          <Dialog.Title className={styles.dialogTitle}>Create New Setting</Dialog.Title>
          <form onSubmit={handleSubmit}>
            {errorMessage && <div className={styles.errorMessage}>{errorMessage}</div>}
            <div className={styles.formGroup}>
              <label htmlFor="key" className={styles.label}>Key</label>
              <input
                id="key"
                name="key"
                type="text"
                placeholder="ex. workingHours"
                value={settingData.key}
                onChange={handleInputChange}
                className={styles.input}
                required
              />
            </div>
            <div className={styles.formGroup}>
              <label htmlFor="value" className={styles.label}>Value</label>
              <textarea
                id="value"
                name="value"
                placeholder="ex. 9-5, Mon-Fri; 10-2, Sat. You can use any format you like; natural language is fine too"
                value={settingData.value}
                onChange={handleInputChange}
                className={styles.input}
                required
              />
            </div>
            <div className={styles.buttonContainer}>
              <Dialog.Close asChild>
                <button type="button" className={styles.closeButton}>Cancel</button>
              </Dialog.Close>
              <button type="submit" className={styles.submitButton}>
                Create Setting
              </button>
            </div>
          </form>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
};

export default CreateSettingDialog;