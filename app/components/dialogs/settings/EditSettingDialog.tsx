import React, { useState, useEffect } from 'react';
import * as Dialog from '@radix-ui/react-dialog';
import styles from '../DialogStyle.module.css';
import { Setting, UpdateSettingDto, settingsApi } from '@/app/api/settingsApi';

interface EditSettingDialogProps {
  isOpen: boolean;
  onClose: () => void;
  setting: Setting | null;
  onSettingUpdated: (setting: Setting) => void;
}

const EditSettingDialog: React.FC<EditSettingDialogProps> = ({
  isOpen,
  onClose,
  setting,
  onSettingUpdated,
}) => {
  const [settingData, setSettingData] = useState<UpdateSettingDto>({
    value: '',
  });
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    if (setting) {
      setSettingData({ value: setting.value });
    }
  }, [setting]);

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setSettingData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!setting) return;

    try {
      if (!settingData.value) {
        setErrorMessage('Value is required');
        return;
      }
      const updatedSetting = await settingsApi.update(setting.key, settingData);
      onSettingUpdated(updatedSetting);
      onClose();
    } catch (error) {
      console.error('Error updating setting:', error);
      setErrorMessage('An error occurred while updating the setting');
    }
  };

  if (!setting) return null;

  return (
    <Dialog.Root open={isOpen} onOpenChange={onClose}>
      <Dialog.Portal>
        <Dialog.Overlay className={styles.dialogOverlay} />
        <Dialog.Content className={styles.dialogContent}>
          <Dialog.Title className={styles.dialogTitle}>Edit Setting: {setting.key}</Dialog.Title>
          <form onSubmit={handleSubmit}>
            {errorMessage && <div className={styles.errorMessage}>{errorMessage}</div>}
            <div className={styles.formGroup}>
              <label htmlFor="value" className={styles.label}>Value</label>
              <textarea
                id="value"
                name="value"
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
                Update Setting
              </button>
            </div>
          </form>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
};

export default EditSettingDialog;