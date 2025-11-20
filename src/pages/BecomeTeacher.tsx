import {
  Box,
  Container,
  Heading,
  Text,
  Button,
  VStack,
  HStack,
  SimpleGrid,
  Icon,
  useColorModeValue,
  Stack,
  Badge,
  Flex,
  Divider,
  Avatar,
  AvatarGroup,
} from "@chakra-ui/react";
import { Link as RouterLink } from "react-router-dom";
import {
  FiDollarSign,
  FiClock,
  FiUsers,
  FiHeart,
  FiCheck,
  FiArrowRight,
  FiStar,
  FiGlobe,
} from "react-icons/fi";
import { motion } from "framer-motion";

const MotionBox = motion(Box);

const benefits = [
  {
    icon: FiDollarSign,
    title: "Competitive Pay",
    description:
      "Earn $15-25 per hour teaching Swahili to motivated students worldwide.",
    color: "green.500",
  },
  {
    icon: FiClock,
    title: "Flexible Schedule",
    description: "Set your own hours and teach when it works best for you.",
    color: "blue.500",
  },
  {
    icon: FiUsers,
    title: "Global Community",
    description:
      "Connect with students from around the world and share your culture.",
    color: "purple.500",
  },
  {
    icon: FiHeart,
    title: "Make an Impact",
    description:
      "Help students build confidence and connections through language learning.",
    color: "red.500",
  },
];

const stats = [
  { value: "500+", label: "Active Teachers" },
  { value: "10,000+", label: "Students Taught" },
  { value: "4.9/5", label: "Avg Rating" },
  { value: "$2M+", label: "Earned by Teachers" },
];

function BenefitCard({
  icon,
  title,
  description,
  color,
}: {
  icon: React.ComponentType;
  title: string;
  description: string;
  color: string;
}) {
  const cardBg = useColorModeValue("white", "gray.800");
  const borderColor = useColorModeValue("gray.200", "gray.700");
  const hoverBg = useColorModeValue("brand.50", "gray.700");

  return (
    <MotionBox
      whileHover={{ y: -8, boxShadow: "xl" }}
      transition={{ duration: 0.3 }}
    >
      <Box
        p={8}
        bg={cardBg}
        border="1px"
        borderColor={borderColor}
        borderRadius="2xl"
        textAlign="center"
        h="full"
        position="relative"
        overflow="hidden"
        _hover={{
          bg: hoverBg,
          borderColor: color,
        }}
        transition="all 0.3s"
      >
        <Box
          position="absolute"
          top="-20px"
          right="-20px"
          w="100px"
          h="100px"
          bg={color}
          opacity={0.1}
          borderRadius="full"
          filter="blur(20px)"
        />
        <Flex
          w="16"
          h="16"
          bg={`${color.split(".")[0]}.50`}
          borderRadius="2xl"
          align="center"
          justify="center"
          mx="auto"
          mb={6}
        >
          <Icon as={icon} w={8} h={8} color={color} />
        </Flex>
        <Heading size="md" mb={3}>
          {title}
        </Heading>
        <Text color="gray.600" fontSize="sm" lineHeight="tall">
          {description}
        </Text>
      </Box>
    </MotionBox>
  );
}

export default function BecomeTeacher() {
  const gradient = useColorModeValue(
    "linear(to-br, brand.50, white, blue.50)",
    "linear(to-br, gray.900, gray.800)"
  );
  const cardBg = useColorModeValue("white", "gray.800");
  const borderColor = useColorModeValue("gray.200", "gray.700");

  return (
    <Box>
      {/* Hero Section */}
      <Box
        bgGradient={gradient}
        position="relative"
        overflow="hidden"
        pt={{ base: 16, md: 24 }}
        pb={{ base: 20, md: 32 }}
      >
        <Container maxW="6xl" position="relative">
          <VStack spacing={8} textAlign="center" maxW="4xl" mx="auto">
            <Badge
              colorScheme="brand"
              fontSize="sm"
              px={4}
              py={2}
              borderRadius="full"
              textTransform="none"
            >
              <HStack spacing={2}>
                <Icon as={FiStar} />
                <Text>Join 500+ Teachers Worldwide</Text>
              </HStack>
            </Badge>

            <MotionBox
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <Heading
                size={{ base: "2xl", md: "3xl" }}
                fontWeight="bold"
                lineHeight="shorter"
              >
                Teach Swahili,{" "}
                <Text as="span" color="brand.500">
                  Earn on Your Terms
                </Text>
              </Heading>
            </MotionBox>

            <MotionBox
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <Text
                fontSize={{ base: "lg", md: "xl" }}
                color="gray.600"
                maxW="2xl"
              >
                Share your passion for Swahili culture and language with
                students around the world. Set your own schedule, work from
                anywhere, and make a lasting impact.
              </Text>
            </MotionBox>

            <MotionBox
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              <HStack spacing={4} flexWrap="wrap" justify="center">
                <Button
                  as={RouterLink}
                  to="/teacher-application"
                  colorScheme="brand"
                  size="lg"
                  rightIcon={<FiArrowRight />}
                  px={8}
                  h={14}
                  fontSize="lg"
                  _hover={{
                    transform: "translateY(-2px)",
                    boxShadow: "xl",
                  }}
                  transition="all 0.3s"
                >
                  Apply Now
                </Button>
                <Button
                  variant="outline"
                  size="lg"
                  px={8}
                  h={14}
                  fontSize="lg"
                  leftIcon={<FiGlobe />}
                >
                  Watch Demo
                </Button>
              </HStack>
            </MotionBox>

            {/* Social Proof */}
            <HStack spacing={8} pt={4} flexWrap="wrap" justify="center">
              <HStack>
                <AvatarGroup size="sm" max={4}>
                  <Avatar name="Teacher 1" bg="brand.400" />
                  <Avatar name="Teacher 2" bg="blue.400" />
                  <Avatar name="Teacher 3" bg="green.400" />
                  <Avatar name="Teacher 4" bg="purple.400" />
                  <Avatar name="Teacher 5" bg="red.400" />
                </AvatarGroup>
                <Text fontSize="sm" color="gray.600">
                  <strong>500+</strong> active teachers
                </Text>
              </HStack>
              <HStack spacing={1} color="orange.400">
                {[...Array(5)].map((_, i) => (
                  <Icon key={i} as={FiStar} fill="currentColor" />
                ))}
                <Text fontSize="sm" color="gray.600" ml={2}>
                  <strong>4.9</strong> average rating
                </Text>
              </HStack>
            </HStack>
          </VStack>
        </Container>
      </Box>

      {/* Stats Section */}
      <Box
        py={{ base: 12, md: 16 }}
        bg={useColorModeValue("gray.50", "gray.900")}
      >
        <Container maxW="6xl">
          <SimpleGrid columns={{ base: 2, md: 4 }} spacing={8}>
            {stats.map((stat, index) => (
              <MotionBox
                key={stat.label}
                textAlign="center"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <Heading size={{ base: "xl", md: "2xl" }} color="brand.500">
                  {stat.value}
                </Heading>
                <Text
                  color="gray.600"
                  mt={2}
                  fontSize={{ base: "sm", md: "md" }}
                >
                  {stat.label}
                </Text>
              </MotionBox>
            ))}
          </SimpleGrid>
        </Container>
      </Box>

      {/* Benefits Grid */}
      <Box py={{ base: 12, md: 20 }}>
        <Container maxW="6xl">
          <VStack spacing={12}>
            <VStack spacing={4} textAlign="center" maxW="3xl">
              <Heading size={{ base: "xl", md: "2xl" }}>
                Why Teachers Love Ztalk
              </Heading>
              <Text fontSize={{ base: "md", md: "lg" }} color="gray.600">
                Join a community that values your expertise and supports your
                success
              </Text>
            </VStack>

            <SimpleGrid
              columns={{ base: 1, md: 2, lg: 4 }}
              spacing={6}
              w="full"
            >
              {benefits.map((benefit, index) => (
                <MotionBox
                  key={benefit.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  viewport={{ once: true }}
                >
                  <BenefitCard
                    icon={benefit.icon}
                    title={benefit.title}
                    description={benefit.description}
                    color={benefit.color}
                  />
                </MotionBox>
              ))}
            </SimpleGrid>
          </VStack>
        </Container>
      </Box>

      {/* Requirements Section */}
      <Box
        py={{ base: 12, md: 20 }}
        bg={useColorModeValue("gray.50", "gray.900")}
      >
        <Container maxW="5xl">
          <VStack spacing={12}>
            <VStack spacing={4} textAlign="center">
              <Badge
                colorScheme="purple"
                fontSize="sm"
                px={4}
                py={2}
                borderRadius="full"
              >
                Requirements
              </Badge>
              <Heading size={{ base: "xl", md: "2xl" }}>
                What We&apos;re Looking For
              </Heading>
              <Text
                fontSize={{ base: "md", md: "lg" }}
                color="gray.600"
                maxW="2xl"
              >
                We welcome passionate educators who meet these criteria
              </Text>
            </VStack>

            <SimpleGrid columns={{ base: 1, md: 2 }} spacing={8} w="full">
              <MotionBox
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6 }}
                viewport={{ once: true }}
              >
                <Box
                  p={8}
                  bg={cardBg}
                  borderRadius="2xl"
                  border="1px"
                  borderColor={borderColor}
                  h="full"
                >
                  <HStack spacing={3} mb={6}>
                    <Flex
                      w="12"
                      h="12"
                      bg="brand.50"
                      borderRadius="xl"
                      align="center"
                      justify="center"
                    >
                      <Icon as={FiUsers} w={6} h={6} color="brand.500" />
                    </Flex>
                    <Heading size="md">Experience & Skills</Heading>
                  </HStack>
                  <Stack spacing={4}>
                    {[
                      "Native or fluent Swahili speaker",
                      "Teaching experience (formal or informal)",
                      "Strong communication skills",
                      "Patience and enthusiasm for teaching",
                      "Cultural knowledge to share",
                    ].map((item) => (
                      <HStack key={item} align="start">
                        <Icon
                          as={FiCheck}
                          color="green.500"
                          mt={1}
                          flexShrink={0}
                        />
                        <Text>{item}</Text>
                      </HStack>
                    ))}
                  </Stack>
                </Box>
              </MotionBox>

              <MotionBox
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6 }}
                viewport={{ once: true }}
              >
                <Box
                  p={8}
                  bg={cardBg}
                  borderRadius="2xl"
                  border="1px"
                  borderColor={borderColor}
                  h="full"
                >
                  <HStack spacing={3} mb={6}>
                    <Flex
                      w="12"
                      h="12"
                      bg="blue.50"
                      borderRadius="xl"
                      align="center"
                      justify="center"
                    >
                      <Icon as={FiGlobe} w={6} h={6} color="blue.500" />
                    </Flex>
                    <Heading size="md">Technical Requirements</Heading>
                  </HStack>
                  <Stack spacing={4}>
                    {[
                      "Reliable internet connection (10+ Mbps)",
                      "Computer with HD camera and microphone",
                      "Quiet teaching environment",
                      "Availability for at least 10 hours per week",
                      "Basic tech proficiency",
                    ].map((item) => (
                      <HStack key={item} align="start">
                        <Icon
                          as={FiCheck}
                          color="green.500"
                          mt={1}
                          flexShrink={0}
                        />
                        <Text>{item}</Text>
                      </HStack>
                    ))}
                  </Stack>
                </Box>
              </MotionBox>
            </SimpleGrid>
          </VStack>
        </Container>
      </Box>

      {/* CTA Section */}
      <Box py={{ base: 16, md: 24 }}>
        <Container maxW="4xl">
          <MotionBox
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <Box
              bg="brand.500"
              bgGradient="linear(to-br, brand.400, brand.600)"
              borderRadius="3xl"
              p={{ base: 8, md: 12 }}
              textAlign="center"
              position="relative"
              overflow="hidden"
            >
              <Box
                position="absolute"
                top="-50%"
                right="-20%"
                w="400px"
                h="400px"
                bg="whiteAlpha.200"
                borderRadius="full"
                filter="blur(60px)"
              />
              <VStack spacing={6} position="relative">
                <Heading size={{ base: "xl", md: "2xl" }} color="white">
                  Ready to Make an Impact?
                </Heading>
                <Text
                  fontSize={{ base: "md", md: "lg" }}
                  color="whiteAlpha.900"
                  maxW="2xl"
                >
                  Join hundreds of teachers who are already making a difference
                  in students&apos; lives while earning competitive income on
                  their own schedule.
                </Text>
                <Divider borderColor="whiteAlpha.400" maxW="md" />
                <HStack spacing={4} flexWrap="wrap" justify="center">
                  <Button
                    as={RouterLink}
                    to="/teacher-application"
                    size="lg"
                    bg="white"
                    color="brand.500"
                    _hover={{
                      transform: "translateY(-2px)",
                      boxShadow: "xl",
                    }}
                    rightIcon={<FiArrowRight />}
                    px={8}
                    h={14}
                    fontSize="lg"
                  >
                    Start Your Application
                  </Button>
                  <Button
                    size="lg"
                    variant="outline"
                    borderColor="white"
                    color="white"
                    _hover={{
                      bg: "whiteAlpha.200",
                    }}
                    px={8}
                    h={14}
                    fontSize="lg"
                  >
                    Contact Us
                  </Button>
                </HStack>
              </VStack>
            </Box>
          </MotionBox>
        </Container>
      </Box>
    </Box>
  );
}
