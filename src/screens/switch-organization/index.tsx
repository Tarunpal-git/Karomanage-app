import React, { useMemo } from "react";
import SafeView from "../../@ui/safe-view/SafeView";
import AppHeader from "../../@ui/app-header/AppHeader";
import { useNavigation } from "@react-navigation/native";
import { TProfileStackNavigator } from "../../navigators/tab-navigator/sub-stack-navigator/ProfileStackNavigator";
import { useOrganizationsListQuery } from "../../apis/hooks/organization/query/useOrganizationsList.query";
import ThemeScrollView from "../../@ui/theme-scroll-view/ThemeScrollView";
import OrganizationCard from "../../@ui/organization-card/OrganizationCard";
import { useAppSelector } from "../../app/hooks";
import { handleSwitchOrganization } from "../../utils/switchOrganization";
import { useOrganizationDetailsQuery } from "../../apis/hooks/organization/query/useOrganizationDetails.query";

const SwitchOrganization = () => {
  const navigation = useNavigation<TProfileStackNavigator>();
  const { data, isLoading, refetch } = useOrganizationsListQuery();
  const { refetch: switchOrganization } = useOrganizationDetailsQuery();

  const selectedOrganization = useAppSelector(
    (state) => state.auth.selectedOrganization
  );

  const organizationNames: TOrganizationName[] = useMemo(() => {
    if (!isLoading && data.data) {
      return data.data.organizations?.organizationNames ?? [];
    } else {
      return [];
    }
  }, [isLoading, data]);

  
  return (
    <SafeView>
      <AppHeader
        showDrawer={false}
        handleBackClick={() => navigation.navigate("Profile")}
        title="Switch Organization"
      />
      <ThemeScrollView loading={isLoading} reloadData={refetch}>
        {organizationNames.map((organization) => (
          <OrganizationCard
            onClick={(e) => {
              handleSwitchOrganization(e);
              switchOrganization();
            }}
            key={organization.organizationId}
            data={{
              customerId: organization.customerId,
              organizationId: organization.organizationId,
              organizationName: organization.organizationName,
              subscription:organization?.organizationSubscriptions,
              role:organization?.role?.permissions || []
            }}
            checked={
              selectedOrganization?.organizationId ===
              organization.organizationId
            }
          />
        ))}
      </ThemeScrollView>
    </SafeView>
  );
};

export default SwitchOrganization;