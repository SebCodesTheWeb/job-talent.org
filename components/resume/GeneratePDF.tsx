import React, { useEffect } from 'react'
import { jsPDF } from 'jspdf'
import { toPng } from 'html-to-image'
import { ResumeTemplate } from './ResumeTemplate'
import { HStack, Heading, Icon, useToast } from '@chakra-ui/react'
import { SimpleButton } from '../portfolio'
import { IoDocumentOutline } from 'react-icons/io5'

type props = {
  data?: any
}

const GeneratePdf = ({ data }: props) => {
  const ref = React.useRef<HTMLDivElement>(null)
  const [resumeVisible, setResumeVisible] = React.useState(false)
  const toast = useToast()

  useEffect(() => {
    const generateImage = async () => {
      if (ref.current === null) return
      const image = await toPng(ref.current, { quality: 1, cacheBust: true })
      const doc = new jsPDF()
      let userOnMobile = false
      doc.addImage(image, 'JPEG', 0, 0, 210, 297)
      if (
        /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
          navigator.userAgent
        )
      ) {
        window.open(doc.output('bloburl'), '_blank')
        userOnMobile = true
      } else {
        doc.save(data.firstname + data.lastname + '-resume.pdf')
      }

      if (!userOnMobile) {
        toast({
          title: `${data.firstname}${data.lastname}-resume.pdf saved`,
          description: 'Check your downloads folder',
          status: 'success',
          duration: 9000,
          position: 'top-right',
          isClosable: true,
        })
      }
    }
    generateImage()
    setResumeVisible(false)
  }, [data, resumeVisible, toast])

  return (
    <div className="button-container">
      <SimpleButton onClick={() => setResumeVisible(true)}>
        <HStack>
          <Heading size="sm">Resume</Heading>
          <Icon as={IoDocumentOutline} className="icon" />
        </HStack>
      </SimpleButton>
      {resumeVisible && <ResumeTemplate ref={ref} data={data} />}
    </div>
  )
}

export default GeneratePdf
