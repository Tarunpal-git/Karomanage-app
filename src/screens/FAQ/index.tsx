import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  FlatList,
  StyleSheet,
} from "react-native";
import AppHeader from "../../@ui/app-header/AppHeader";
import { useNavigation } from "@react-navigation/native";
import { TProfileStackNavigator } from "../../navigators/tab-navigator/sub-stack-navigator/ProfileStackNavigator";

interface FAQItem {
  id: string;
  question: string;
  answer: string;
}

const faqData: FAQItem[] = [
  {
    id: "1",
    question: "What is Karomanage?",
    answer:
      " Karomanage is a coaching management software designed to streamline operations, automate fee management and strengthen your brand. It integrates LMS (Learning Management System) and ERP (Enterprise Resource Planning) functionalities, catering to both online and offline educational needs.",
  },
  {
    id: "2",
    question: "How to download Karomanage app?",
    answer:
      "Open the Google Play Store, search for “Karomanage”, and tap “Install'.",
  },
  {
    id: "3",
    question: "What features do Karomanage offer?",
    answer:
      "Karomanage is an all-in-one ERP and LMS platform for coaching centers, offering features like student and teacher management, attendance, courses, leads, marketing, chat, reports, and user permissions.",
  },
  {
    id: "4",
    question: "How do I access my data?",
    answer:
      "To access your data on the Karomanage app, log in to the app using the same credentials as the portal. It provides access to features like student details, attendance, leads, courses, chat, and reports, ensuring real-time data updates and seamless management.",
  },
  {
    id: "5",
    question: "Where to learn about Karomanage?",
    answer:
      "Visit the official Karomanage website for detailed information and resources.",
  },
];

const FAQ: React.FC = () => {
  const navigation = useNavigation<TProfileStackNavigator>(); // Move the useNavigation here
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const toggleExpand = (id: string) => {
    setExpandedId((prev) => (prev === id ? null : id));
  };

  const renderFAQItem = ({ item }: { item: FAQItem }) => {
    const isExpanded = item.id === expandedId;
    return (
      <View style={styles.faqItem}>
        <TouchableOpacity
          onPress={() => toggleExpand(item.id)}
          style={styles.questionContainer}
        >
          <Text style={styles.questionText}>{item.question}</Text>
          <Text style={styles.icon}>{isExpanded ? "▲" : "▼"}</Text>
        </TouchableOpacity>
        {isExpanded && <Text style={styles.answerText}>{item.answer}</Text>}
      </View>
    );
  };

  return (
    <View style={styles.containerr}>
      <AppHeader
        title="FAQ"
        showDrawer={false}
        handleBackClick={() => navigation.navigate("Profile")}
      />
      <View style={styles.container}>
      <FlatList
        data={faqData}
        renderItem={renderFAQItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContainer}
      />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {

    backgroundColor: "#fff",
    padding: 16,
    top: '2%',
  },
  containerr: {
    flex: 1,
    backgroundColor: "#fff",
    padding: 16,
    top: '-2%',
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
    marginVertical: 16,
  },
  listContainer: {
    paddingBottom: 16,
  },
  faqItem: {
    marginBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
    paddingBottom: 8,
  },
  questionContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  questionText: {
    fontSize: 16,
    fontWeight: "bold",
    flex: 1,
    color: "black",
  },
  icon: {
    fontSize: 16,
    marginLeft: 8,
    color: "black",
  },
  answerText: {
    fontSize: 14,
    color: "#333",
    marginTop: 8,
  },
});

export default FAQ;
