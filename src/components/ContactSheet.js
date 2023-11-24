import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import ChipButton from './ChipButton'
import Button from './Button'

export default function ContactSheet() {
  return (
    <View>
      <View style={styles.cardContainer}>
          <Text style={styles.title}>Trusted Contacts</Text>
          <View style={styles.contactCard}>
            <View>
                
            </View>
            <Button
              title={"Add Contact"}
              onPress={showAddContactModal}
              altText={"Add Contact"}
            />
          </View>
        </View>
    </View>
  )
}

const styles = StyleSheet.create({})