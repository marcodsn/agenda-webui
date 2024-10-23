import React from 'react';
import * as Dialog from '@radix-ui/react-dialog';
import styles from '../DialogStyle.module.css';
import { Setting, settingsApi } from '@/app/api/settingsApi';

interface DeleteSettingDialogProps {
  isOpen: boolean;
  onClose: () => void;
  setting: Setting | null;
  onSettingDeleted: (key: string) => void;
}

const DeleteSettingDialog: React.FC<DeleteSettingDialogProps> = ({
  isOpen,
  onClose,
  setting,
  onSettingDeleted,
}) => {
  const handleDelete = async () => {
    if (!setting) return;

    try {
      await settingsApi.delete(setting.key);
      onSettingDeleted(setting.key);
      onClose();
    } catch (error) {
      console.error('Error deleting setting:', error);
    }
  };

  if (!setting) return null;

  return (
    <Dialog.Root open={isOpen} onOpenChange={onClose}>
      <Dialog.Portal>
        <Dialog.Overlay className={styles.dialogOverlay} />
        <Dialog.Content className={styles.dialogContent}>
          <Dialog.Title className={styles.dialogTitle}>Delete Setting</Dialog.Title>
          <p className={styles.dialogDescription}>
            Are you sure you want to delete the setting "{setting.key}"? This action cannot be undone.
          </p>
          <div className={styles.buttonContainer}>
            <Dialog.Close asChild>
              <button type="button" className={styles.closeButton}>Cancel</button>
            </Dialog.Close>
            <button
              type="button"
              className={styles.deleteButton}
              onClick={handleDelete}
            >
              Delete Setting
            </button>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
};

export default DeleteSettingDialog;