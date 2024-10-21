import React, { useState, useEffect } from 'react';
import styles from './Header.module.css';
import { IconCloud, IconCurrentLocation } from '@tabler/icons-react';
import * as Tooltip from '@radix-ui/react-tooltip';

const Header: React.FC = () => {
  const [clientDate, setClientDate] = useState(new Date());
  const [romeDate, setRomeDate] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setClientDate(new Date());
      setRomeDate(new Date(new Date().toLocaleString("en-US", { timeZone: "Europe/Rome" })));
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const formatDate = (date: Date) => {
    return date.toLocaleString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      // second: '2-digit',
      hour12: false,
    });
  };

  return (
    <header className={`${styles.header} flex items-center justify-between`}>
      <div className={styles.brand}>
        <a href="https://marcodsn.me">marcodsn</a> / <span className='font-bold'>agenda</span>
      </div>
      <Tooltip.Provider>
        <Tooltip.Root>
          <Tooltip.Trigger asChild>
            <div className={`${styles.dates} hidden md:flex items-center whitespace-nowrap`}>
              <IconCurrentLocation className="mr-1 size-5" />
              <span className="mr-3">{formatDate(clientDate)}</span>
              <span className="mr-2">-</span>
              <IconCloud className="mr-1 size-5" />
              <span>{formatDate(romeDate)}</span>
            </div>
          </Tooltip.Trigger>
          <Tooltip.Portal>
            <Tooltip.Content className={styles.tooltip}>
              <p>Local time - Server time (Rome)</p>
              <Tooltip.Arrow className="fill-gray-500" />
            </Tooltip.Content>
          </Tooltip.Portal>
        </Tooltip.Root>
      </Tooltip.Provider>
      <div className={styles.buttons}>
        <a href="/about" className={styles.button}>About</a>
        <a href="/contact" className={`${styles.button} ${styles.cta}`}>Contact Us</a>
      </div>
    </header>
  );
};

export default Header;