import styles from './Table.module.scss';

export const Table = ({ children }) => {
  return <div className={styles.tableWrapper}>{children}</div>;
};
