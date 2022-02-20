import Head from "next/head";
import Image from "next/image";
import { useState } from "react";
import { useTranslation } from "next-i18next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { useRouter } from "next/router";
import styles from "../styles/Home.module.css";
import Link from "next/link";

interface FAQ {
  answer: string;
  createdAt: string;
  publishedAt: string;
  question: string;
  updatedAt: string;
}

interface FAQItem {
  id: number;
  attributes: FAQ;
}

interface FAQData {
  data: FAQItem[];
}

const FAQ: React.FC<{ faq: FAQItem }> = ({ faq }) => {
  const [expanded, setExpanded] = useState(false);
  return (
    <div className={styles.faqItem}>
      <div className={styles.faqRow} onClick={() => setExpanded(!expanded)}>
        <h2>{faq.attributes.question}</h2>
        <div className={styles.faqButton}>{expanded ? "-" : "+"}</div>
      </div>
      <div
        className={`${styles.faqContent} ${
          expanded && styles.faqContentExpanded
        }`}
      >
        <p dangerouslySetInnerHTML={{ __html: faq.attributes.answer }} />
      </div>
    </div>
  );
};

const Home: React.FC<{ data: FAQData }> = ({ data }) => {
  const { locale, locales } = useRouter();
  const faqItems = data.data;
  const { t } = useTranslation("common");
  return (
    <div className={styles.container}>
      <Head>
        <title>{t("faq")}</title>
        <meta name="description" content="Generated by create next app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.main}>
        <h1 className={styles.faqTitle}>{t("faq")}</h1>
        <div className={styles.localeWrapper}>
          {locales &&
            locales.map((value, index) => (
              <div key={index}>
                {value !== locale && (
                  <Link key={value} href="/" locale={value}>
                    {value.toUpperCase()}
                  </Link>
                )}
              </div>
            ))}
        </div>
        <div className={styles.faqContainer}>
          {faqItems.map((faq, index) => (
            <FAQ key={index} faq={faq} />
          ))}
        </div>
      </main>
    </div>
  );
};

export async function getServerSideProps({ locale }) {
  // Fetch FAQ data
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/api/faqs?locale=${locale}`,
    {
      headers: {
        Authorization: `Bearer ${process.env.NEXT_PUBLIC_STRAPI_TOKEN}`,
      },
    }
  );
  const data = await res.json();

  //get locale data
  const localeData = await serverSideTranslations(locale, ["common"]);

  // Pass data to the page via props
  return { props: { ...localeData, data } };
}

export default Home;
