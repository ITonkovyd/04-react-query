import toast, { Toaster } from 'react-hot-toast';
import styles from "./SearchBar.module.css";
import { Formik, Form, Field, type FormikHelpers } from "formik";

type Props = {
  onSubmit: (query: string) => void;
};

interface SearchBarValues {
  query: string;
}

const SearchBar = ({ onSubmit }: Props) => {
  const handleSubmitForm = (
    values: SearchBarValues,
    actions: FormikHelpers<SearchBarValues>
  ) => {
    const { query } = values;
    if (!query.trim()) {
      toast.error("Please enter your search query.");
      return;
    }

    onSubmit(query);
    actions.resetForm();
  };

  return (
    <header className={styles.header}>
      <div className={styles.container}>
        <a
          className={styles.link}
          href="https://www.themoviedb.org/"
          target="_blank"
          rel="noopener noreferrer"
        >
          Powered by TMDB
        </a>
        <Formik initialValues={{ query: "" }} onSubmit={handleSubmitForm}>
          <Form className={styles.form}>
            <Field
              className={styles.input}
              type="text"
              name="query"
              autoComplete="off"
              placeholder="Search movies..."
              autoFocus
            />
            <button className={styles.button} type="submit">
              Search
            </button>
          </Form>
        </Formik>
      </div>
      <Toaster />
    </header>
  );
};

export default SearchBar