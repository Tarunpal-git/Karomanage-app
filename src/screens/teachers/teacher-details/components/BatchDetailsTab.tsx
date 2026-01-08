import React, { FC, memo, useState } from "react";
import Flex from "../../../../@ui/flex/Flex";
import BatchAccordionRow from "./BatchAccordionRow";
import Center from "../../../../@ui/center/Center";
import ScalableText from "../../../../@ui/scalable-text/ScalableText";
import { COLORS } from "../../../../colors";

interface IBatchDetailsTab {
  batches: TTeacherBatches[];
}

const BatchDetailsTab: FC<IBatchDetailsTab> = ({ batches }) => {
  const filteredBatches = batches.filter((batch) => batch.batchId !== "");
console.log("filteredBatches", filteredBatches);

  const [openDetails, setOpenDetails] = useState<string | null>(null);

  const handleToggle = (batchId: string) => {
    setOpenDetails((prev) => (prev === batchId ? null : batchId));
  };

  return (
    <Flex flexDirection="column" mt={20}>
      {filteredBatches.length === 0 && (
        <Center styles={{ minHeight: 350 }}>
          <ScalableText
            fontFamily="Medium"
            style={{ color: COLORS.black, fontSize: 14 }}
          >
            No data found
          </ScalableText>
        </Center>
      )}
      {filteredBatches.map((batch, index) => (
        <BatchAccordionRow
          batch={batch}
          key={`${batch}_${index}`}
          isOpen={!(openDetails === batch.batchId)}
          onToggle={() => handleToggle(batch.batchId)}
        />
      ))}
    </Flex>
  );
};

export default memo(BatchDetailsTab);
