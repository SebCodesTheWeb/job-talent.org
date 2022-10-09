import React from 'react'
import { Heading, Text, Stack, HStack } from '@chakra-ui/react'

import { CompanyTag } from './CompanyTag'
interface Props {
  jobTitle: string
  companyName: string
  location: string
  date: string
  workTasks: string
  bgColor?: 'cyan.500' | 'purple.500' | 'gray.500'
}

export const ExperienceCard = ({
  jobTitle,
  companyName,
  location,
  date,
  workTasks,
  bgColor = 'cyan.500',
}: Props) => {
  return (
    <Stack maxW="400px">
      <Heading size="md">{jobTitle}</Heading>
      <HStack>
        <CompanyTag
          companyName={companyName}
          bgColor={bgColor}
          location={location}
        />
      </HStack>
      <Text color="gray.800" fontWeight="light" fontSize="sm">
        {date}
      </Text>
      <Text maxW="80%" textOverflow="wrap" textAlign="start">
        {workTasks}
      </Text>
    </Stack>
  )
}
