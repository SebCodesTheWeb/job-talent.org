import { useContext, useRef } from 'react'
import type { NextPage } from 'next'
import Head from 'next/head'
import NextLink from 'next/link'
import { useRouter } from 'next/router'
import { useState } from 'react'
import {
  Contact,
  WorkExperience,
  Education,
  Links,
  Portfolio,
  About,
  Skills,
  WorkImages,
} from '../../components'
import { doc, getDoc, setDoc } from 'firebase/firestore'
import { db, storage, signIn, signOut, UserContext } from '../../firebase'
import { ref, uploadBytes } from 'firebase/storage'
import { Step, Steps, useSteps } from 'chakra-ui-steps'
import {
  Box,
  Image,
  Stack,
  ModalBody,
  ModalFooter,
  ModalHeader,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalCloseButton,
  Input,
  Heading,
  Center,
  VStack,
  HStack,
  useDisclosure,
  LinkBox,
  LinkOverlay,
  Text,
  Button,
  Flex,
} from '@chakra-ui/react'
import { Formik, Form } from 'formik'
import { arrayWithLength } from '../../utils'

const Home: NextPage = ({ portfolioData, portfolioId }: any) => {
  const { nextStep, prevStep, setStep, reset, activeStep } = useSteps({
    initialStep: 0,
  })
  const router = useRouter()
  const [skills, setSkills] = useState(
    arrayWithLength(portfolioData.skillLength)
  )
  const [projects, setProjects] = useState(
    arrayWithLength(portfolioData.projectLength)
  )
  const [jobs, setJobs] = useState(arrayWithLength(portfolioData.jobLength))
  const [education, setEducation] = useState(
    arrayWithLength(portfolioData.educationLength)
  )
  const [images, setImages] = useState(
    arrayWithLength(portfolioData.imageLength)
  )
  const [imageSRCS, setImageSRCS] = useState([0, 0, 0, 0, 0, 0, 0])

  const { isOpen, onOpen, onClose } = useDisclosure()
  const [portfolioURL, setPortfolioURL] = useState('')

  const renderForm = (handleChange: any, values: any) => {
    switch (activeStep) {
      case 0:
        return (
          <Contact
            handleChange={handleChange}
            values={values}
            currentStep={activeStep + 1}
          />
        )
      case 1:
        return (
          <WorkExperience
            handleChange={handleChange}
            values={values}
            currentStep={activeStep + 1}
            jobs={jobs}
            setJobs={setJobs}
          />
        )
      case 2:
        return (
          <WorkImages
            handleChange={handleChange}
            values={values}
            currentStep={activeStep + 1}
            images={images}
            setImages={setImages}
            setImageSRCS={setImageSRCS}
            imageSRCS={imageSRCS}
          />
        )
      case 3:
        return (
          <Education
            handleChange={handleChange}
            values={values}
            currentStep={activeStep + 1}
            education={education}
            setEducation={setEducation}
          />
        )
        break
      case 4:
        return (
          <About
            handleChange={handleChange}
            values={values}
            currentStep={activeStep + 1}
          />
        )
      case 5:
        return (
          <Portfolio
            handleChange={handleChange}
            values={values}
            currentStep={activeStep + 1}
            projects={projects}
            setProjects={setProjects}
          />
        )
      case 6:
        return (
          <Skills
            handleChange={handleChange}
            values={values}
            currentStep={activeStep + 1}
            skills={skills}
            setSkills={setSkills}
          />
        )
      case 7:
        return (
          <Links
            handleChange={handleChange}
            values={values}
            currentStep={activeStep + 1}
          />
        )
      case 8:
        return (
          <Stack spacing={4}>
            <Heading size="md">Portfolio Data:</Heading>
            <Text
              fontWeight="bold"
              fontSize="sm"
              whiteSpace="pre"
              fontFamily="monospace"
              maxHeight="800px"
              overflowY="scroll"
            >
              {JSON.stringify(values, null, 2)}
            </Text>
          </Stack>
        )
    }
  }

  const steps = [
    { label: 'Contact' },
    { label: 'Work' },
    { label: 'Images' },
    { label: 'Education' },
    { label: 'About Me' },
    { label: 'Portfolio' },
    { label: 'Skills' },
    { label: 'Links' },
  ]

  return (
    <Center pt={4} minH="100vh" bgColor="gray.700" color="#fff" py={8}>
      <Head>
        <title> Job-talent.org </title>
      </Head>
      <VStack>
        <VStack>
          <LinkBox>
            <VStack>
              <NextLink href="/" passHref={true}>
                <LinkOverlay />
              </NextLink>
              <Image
                src="/img/logo_white.png"
                alt="Job-talent logo"
                w="150px"
              />
              <Heading>Job Talent</Heading>
            </VStack>
          </LinkBox>
          <Text as="em">
            Write <strong>your</strong> resume
          </Text>
        </VStack>
        <Formik
          initialValues={portfolioData}
          onSubmit={async (values) => {
            try {
              await setDoc(doc(db, 'test-users', portfolioId), {
                ...values,
                skillLength: skills.length,
                projectLength: projects.length,
                jobLength: jobs.length,
                educationLength: education.length,
                imageLength: images.length,
                portfolioURL,
              })
              imageSRCS.forEach((imageSRC: any, index: number) => {
                if (imageSRC && values.images[index].title) {
                  const imageRef = ref(
                    storage,
                    `images/${values.images[index].title}`
                  )
                  console.log(imageSRC)
                  uploadBytes(imageRef, imageSRC)
                    .then(() => {
                      console.log('upload success')
                    })
                    .catch(() => {
                      console.log('upload failed')
                    })
                }
              })
              router.push(`/user/${portfolioURL}`)
            } catch (e) {
              console.error('Error adding document: ', e)
            }
          }}
        >
          {({ values, handleChange, handleSubmit }) => (
            <Form>
              <VStack
                alignItems="start"
                mt={4}
                border="1px solid #fff"
                py={4}
                px={16}
                borderRadius={8}
                w={{ base: 'max-content', md: '700px' }}
                h="1000px"
                spacing={4}
              >
                <Flex alignItems="start" h="full" gap={4}>
                  <Box w="200px" alignSelf="center">
                    <Steps
                      orientation="vertical"
                      activeStep={activeStep}
                      onClickStep={(step) => setStep(step)}
                    >
                      {steps.map(({ label }) => (
                        <Step label={label} key={label} color="#fff" />
                      ))}
                    </Steps>
                  </Box>
                  <Box alignSelf="center" w="350px">
                    {renderForm(handleChange, values)}
                  </Box>
                </Flex>
                <Modal isOpen={isOpen} onClose={onClose} isCentered={true}>
                  <ModalOverlay />
                  <ModalContent
                    bgColor="gray.700"
                    color="#fff"
                    border="1px solid #fff"
                  >
                    <ModalHeader>Webpage name</ModalHeader>
                    <ModalCloseButton />
                    <ModalBody>
                      <HStack>
                        <Text fontSize="lg">https://jobtalent.org/</Text>
                        <Input
                          value={portfolioURL}
                          onChange={(e) => setPortfolioURL(e.target.value)}
                        />
                      </HStack>
                    </ModalBody>
                    <ModalFooter>
                      <Button
                        colorScheme="teal"
                        mr={3}
                        type="submit"
                        onClick={ handleSubmit }
                      >
                        Generate webpage
                      </Button>
                    </ModalFooter>
                  </ModalContent>
                </Modal>
                {activeStep === steps.length ? (
                  <Flex p={4} gap={2}>
                    <Button
                      mx="auto"
                      size="sm"
                      color="gray.700"
                      onClick={onOpen}
                    >
                      Choose Webpage name
                    </Button>
                    <Button
                      isDisabled={activeStep === 0}
                      mr={4}
                      onClick={prevStep}
                      size="sm"
                      variant="ghost"
                      _hover={{ color: 'gray.700', bgColor: '#fff' }}
                    >
                      Go Back
                    </Button>
                  </Flex>
                ) : (
                  <Flex width="100%" justify="flex-end" alignSelf="end">
                    <Button
                      isDisabled={activeStep === 0}
                      mr={4}
                      onClick={prevStep}
                      size="sm"
                      variant="ghost"
                      _hover={{ color: 'gray.700', bgColor: '#fff' }}
                    >
                      Prev
                    </Button>
                    <Button size="sm" onClick={nextStep} color="gray.700">
                      {activeStep === steps.length - 1 ? 'Check Final' : 'Next'}
                    </Button>
                  </Flex>
                )}
              </VStack>
            </Form>
          )}
        </Formik>
      </VStack>
    </Center>
  )
}

export async function getServerSideProps({ params }: any) {
  const portfolioId = params.portfolioId
  const docRef = doc(db, 'test-users', portfolioId)
  const docSnap = await getDoc(docRef)
  const portfolioData = docSnap.exists() ? docSnap.data() : null

  return {
    props: {
      portfolioData,
      portfolioId,
    },
  }
}

export default Home