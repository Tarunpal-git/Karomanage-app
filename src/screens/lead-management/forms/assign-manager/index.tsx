import React, { useEffect, useState } from "react";
import SelectManagersTab from "./tabs/SelectManagersTab";
import SelectLeadsTab from "./tabs/SelectLeadsTab";
import ApproveManagerTab from "./tabs/ApproveManagerTab";
import { RouteProp, useRoute } from "@react-navigation/native";
import { TScreenNavigatorParams } from "../../../../types/navigator/screen-navigator";
import SafeView from "../../../../@ui/safe-view/SafeView";
import AppHeader from "../../../../@ui/app-header/AppHeader";
import Flex from "../../../../@ui/flex/Flex";
import Tabs from "../../../../@ui/tabs/Tabs";

const FormsAssignManager = () => {
  const [steps, setSteps] = useState("selectManager");
  const [selectedManager, setSelectedManager] = useState<
    TSelectedManager | undefined
  >(undefined);
  const [assignedLeads, setAssignedLeads] = useState<TFormEnquiry[]>([]);

  const { params } =
    useRoute<RouteProp<TScreenNavigatorParams, "FormsAssignManager">>();

  const initialTabs = [
    { label: "Select\nManager", value: "selectManager" },
    { label: "Select\nLeads", value: "selectLeads" },
    { label: "Approve", value: "approve" },
  ];

  const [tabs, setTabs] = useState(initialTabs);

  useEffect(() => {
    if (params?.leads && params.leads.length > 0) {
      setAssignedLeads(params.leads);
      setTabs((prevTabs) =>
        prevTabs.filter((tab) => tab.value !== "selectLeads")
      );
    }
  }, [params?.leads]);

  return (
    <SafeView>
      <AppHeader showDrawer={false} title="Assign Manager" />
      <Flex my={20}>
        <Tabs onChange={(e) => setSteps(e)} tabs={tabs} value={steps} />
      </Flex>

      {steps === "selectManager" && (
        <SelectManagersTab
          setTab={setSteps}
          selectedManager={selectedManager}
          setSelectedManager={setSelectedManager}
          leads={assignedLeads}
        />
      )}
      {steps === "selectLeads" && (
        <SelectLeadsTab
          formTemplateId={params?.formTemplateId}
          setTab={setSteps}
          assignedLeads={assignedLeads}
          setAssignedLeads={setAssignedLeads}
        />
      )}
      {steps === "approve" && selectedManager && (
        <ApproveManagerTab
          formTemplateId={params.formTemplateId}
          assignedLeads={assignedLeads}
          selectedManager={selectedManager}
        />
      )}
    </SafeView>
  );
};

export default FormsAssignManager;