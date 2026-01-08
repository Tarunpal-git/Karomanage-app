import React, { FC, memo, useState } from "react";
import { StyleSheet, View, Image, TouchableOpacity, Linking, Alert, Platform, Share, Modal, Dimensions } from "react-native";
import Flex from "../../../../../@ui/flex/Flex";
import ScalableText from "../../../../../@ui/scalable-text/ScalableText";
import { COLORS } from "../../../../../colors";

interface IMedia {
  details: TStudentList;
}

const Media: FC<IMedia> = ({ details }) => {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [isImageModalVisible, setIsImageModalVisible] = useState(false);
  
  // Debug logs to check data
  console.log('🎬 === MEDIA SECTION DEBUG ===');
  console.log('Details object:', details);
  console.log('Student dynamic fields:', (details as any).studentDynamicFields);
  console.log('Custom fields length:', (details as any).studentDynamicFields?.length);
  console.log('🎬 === END MEDIA SECTION DEBUG ===');

  const handleOpenFile = (mediaUri: string) => {
    if (mediaUri) {
      console.log('🎬 Opening image in full screen:', mediaUri);
      setSelectedImage(mediaUri);
      setIsImageModalVisible(true);
    }
  };

  const renderFieldValue = (field: any) => {
    if (field.type === 'Media' || field.type === 'media') {
      return (
        <View style={styles.mediaContainer}>
          {field.value && (
            <TouchableOpacity
              style={styles.imageContainer}
              onPress={() => handleOpenFile(field.value)}
              activeOpacity={0.8}
            >
              <Image 
                source={{ uri: field.value }} 
                style={styles.mediaPreview}
                resizeMode="cover"
              />
              <View style={styles.imageOverlay}>
                <ScalableText style={styles.tapToViewText} fontFamily="Medium">
                  Tap to view full size
                </ScalableText>
              </View>
            </TouchableOpacity>
          )}
        </View>
      );
    } else {
      return (
        <ScalableText style={styles.fieldValue} fontFamily="Regular">
          {field.value || '-'}
        </ScalableText>
      );
    }
  };

  // Filter only MEDIA custom fields from studentDynamicFields
  const allCustomFields = (details as any).studentDynamicFields || [];
  const mediaFields = allCustomFields.filter((field: any) => {
    const fieldType = field.type;
    return fieldType === 'Media' || fieldType === 'media';
  });

  console.log('🎬 Media fields found:', mediaFields.length);

  if (!mediaFields || mediaFields.length === 0) {
    return (
      <Flex mt={15}>
        <View style={styles.emptyContainer}>
          <ScalableText style={styles.emptyText} fontFamily="Medium">
            No media files available
          </ScalableText>
          <ScalableText style={{ fontSize: 12, color: COLORS.muted, textAlign: 'center', marginTop: 8 }} fontFamily="Regular">
            This student has no media files uploaded
          </ScalableText>
        </View>
      </Flex>
    );
  }

  return (
    <Flex mt={15}>
      <View style={styles.container}>
        <ScalableText style={styles.sectionTitle} fontFamily="SemiBold">
          Media Files
        </ScalableText>
        
        {mediaFields.map((field: any, index: number) => {
          console.log('🎬 Rendering field:', field);
          const fieldName = Object.keys(field)[0];
          const fieldValue = field[fieldName];
          const fieldType = field.type;
          
          return (
            <View key={index} style={styles.fieldContainer}>
              <View style={styles.fieldHeader}>
                <ScalableText style={styles.fieldName} fontFamily="Medium">
                  {fieldName}
                </ScalableText>
                <View style={styles.fieldTypeContainer}>
                  <ScalableText style={styles.fieldType} fontFamily="Regular">
                    {fieldType.toUpperCase()}
                  </ScalableText>
                </View>
              </View>
              
              <View style={styles.fieldContent}>
                {renderFieldValue({ ...field, value: fieldValue })}
              </View>
            </View>
          );
        })}
      </View>
      
      {/* Full Screen Image Modal */}
      <Modal
        visible={isImageModalVisible}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setIsImageModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <TouchableOpacity
            style={styles.modalCloseButton}
            onPress={() => setIsImageModalVisible(false)}
          >
            <ScalableText style={styles.modalCloseText} fontFamily="Medium">
              ✕
            </ScalableText>
          </TouchableOpacity>
          
          <TouchableOpacity
            style={styles.modalImageContainer}
            onPress={() => setIsImageModalVisible(false)}
            activeOpacity={1}
          >
            <Image
              source={{ uri: selectedImage || '' }}
              style={styles.fullScreenImage}
              resizeMode="contain"
            />
          </TouchableOpacity>
        </View>
      </Modal>
    </Flex>
  );
};

export default memo(Media);

const styles = StyleSheet.create({
  container: {
    backgroundColor: COLORS.white,
    borderRadius: 12,
    padding: 16,
    marginHorizontal: 4,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    width: "98%",
  },
  sectionTitle: {
    fontSize: 18,
    color: COLORS.black,
    marginBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
    paddingBottom: 8,
  },
  fieldContainer: {
    marginBottom: 16,
    padding: 12,
    backgroundColor: COLORS.whiteSmoke,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  fieldHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  fieldName: {
    fontSize: 16,
    color: COLORS.black,
    flex: 1,
  },
  fieldTypeContainer: {
    backgroundColor: COLORS.primary,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  fieldType: {
    fontSize: 12,
    color: COLORS.white,
    textTransform: 'uppercase',
  },
  fieldContent: {
    marginTop: 4,
  },
  fieldValue: {
    fontSize: 14,
    color: COLORS.black,
    paddingVertical: 8,
    paddingHorizontal: 12,
    backgroundColor: COLORS.white,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  mediaContainer: {
    gap: 8,

  },
  mediaPreview: {
    width: '100%',
    height: 150,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: COLORS.border,
    alignSelf: 'flex-start',
  },
  imageContainer: {
    marginTop: 8,
    alignItems: 'flex-start',
  },
  emptyContainer: {
    backgroundColor: COLORS.white,
    borderRadius: 12,
    padding: 24,
    marginHorizontal: 4,
    alignItems: 'center',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  emptyText: {
    fontSize: 16,
    color: COLORS.muted,
    textAlign: 'center',
  },
  // Modal styles
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.9)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalCloseButton: {
    position: 'absolute',
    top: 50,
    right: 20,
    zIndex: 1000,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    borderRadius: 20,
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalCloseText: {
    color: COLORS.white,
    fontSize: 18,
    fontWeight: 'bold',
  },
  modalImageContainer: {
    flex: 1,
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  fullScreenImage: {
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').height,
  },
  imageOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderBottomLeftRadius: 8,
    borderBottomRightRadius: 8,
  },
  tapToViewText: {
    color: COLORS.white,
    fontSize: 12,
    textAlign: 'center',
    fontWeight: '500',
  },
}); 