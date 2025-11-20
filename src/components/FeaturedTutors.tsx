import {
  Box,
  Container,
  Heading,
  SimpleGrid,
  Stack,
  Text,
  Avatar,
  HStack,
  Icon,
  Badge,
  Button,
  useColorModeValue,
  Flex,
} from "@chakra-ui/react";
import { FiPlay, FiStar, FiVideo, FiGlobe, FiClock } from "react-icons/fi";
import { HiBadgeCheck } from "react-icons/hi";

interface Tutor {
  id: string;
  name: string;
  avatar?: string;
  rating: number;
  reviews: number;
  pricePerLesson: number; // USD placeholder
  introVideo?: string; // future URL
  specialties: string[];
  languages: string[]; // language codes or names
  country: string;
  availabilityTag?: string; // e.g., "Fast Response"
  verified?: boolean;
}

const TUTORS: Tutor[] = [
  {
    id: "t1",
    name: "Aisha",
    rating: 4.9,
    reviews: 128,
    pricePerLesson: 12,
    specialties: ["Safari phrases", "Market negotiation"],
    languages: ["Swahili", "English"],
    country: "TZ",
    availabilityTag: "Fast response",
    verified: true,
  },
  {
    id: "t2",
    name: "Juma",
    rating: 4.8,
    reviews: 94,
    pricePerLesson: 11,
    specialties: ["Cultural etiquette", "Traveler safety"],
    languages: ["Swahili", "English", "French"],
    country: "TZ",
    availabilityTag: "New content",
    verified: true,
  },
  {
    id: "t3",
    name: "Neema",
    rating: 5.0,
    reviews: 210,
    pricePerLesson: 15,
    specialties: ["Beginners", "Pronunciation"],
    languages: ["Swahili", "English", "German"],
    country: "TZ",
    verified: true,
  },
  {
    id: "t4",
    name: "Salim",
    rating: 4.7,
    reviews: 77,
    pricePerLesson: 10,
    specialties: ["Traveler basics", "Custom phrase packs"],
    languages: ["Swahili", "English", "Italian"],
    country: "TZ",
    verified: false,
  },
];

function Rating({ value, reviews }: { value: number; reviews?: number }) {
  const starGradient = "linear-gradient(135deg, #FFD700 0%, #FFA500 100%)";
  const ratingBg = useColorModeValue("orange.50", "orange.900");
  const ratingColor = useColorModeValue("orange.800", "orange.200");
  const textColor = useColorModeValue("gray.600", "gray.400");

  return (
    <HStack
      spacing={1.5}
      bg={ratingBg}
      px={2.5}
      py={1}
      rounded="full"
      fontSize="xs"
      fontWeight="semibold"
      aria-label={`Rating ${value}`}
      transition="all 0.2s"
      _hover={{ transform: "scale(1.05)" }}
    >
      <Box position="relative">
        <Icon
          as={FiStar}
          fill={starGradient}
          stroke="#FFA500"
          strokeWidth={1.5}
          boxSize={3.5}
          filter="drop-shadow(0px 1px 2px rgba(255, 165, 0, 0.3))"
          sx={{
            fill: "url(#tutorStarGradient)",
          }}
        />
        <Box as="svg" position="absolute" w={0} h={0}>
          <defs>
            <linearGradient
              id="tutorStarGradient"
              x1="0%"
              y1="0%"
              x2="100%"
              y2="100%"
            >
              <stop offset="0%" stopColor="#FFD700" />
              <stop offset="100%" stopColor="#FFA500" />
            </linearGradient>
          </defs>
        </Box>
      </Box>
      <Text color={ratingColor}>{value.toFixed(1)}</Text>
      {reviews && <Text color={textColor}>({reviews})</Text>}
    </HStack>
  );
}

function TutorCard({ tutor }: { tutor: Tutor }) {
  const cardBg = useColorModeValue("white", "gray.800");
  const border = useColorModeValue("gray.200", "gray.700");
  const proIconColor = useColorModeValue("brand.500", "brand.300");
  const overlayBg = useColorModeValue(
    "linear-gradient(135deg, rgba(255,215,0,0.05), rgba(255,165,0,0.02))",
    "linear-gradient(135deg, rgba(255,215,0,0.1), rgba(255,165,0,0.05))"
  );
  // Badge check icon for a stronger verified badge visual
  const ProIcon = HiBadgeCheck;

  return (
    <Stack
      role="group"
      spacing={4}
      p={5}
      rounded="2xl"
      bg={cardBg}
      borderWidth="1px"
      borderColor={border}
      shadow="md"
      position="relative"
      transition="all 0.3s cubic-bezier(0.4, 0, 0.2, 1)"
      overflow="hidden"
      _before={{
        content: '""',
        position: "absolute",
        inset: 0,
        bg: overlayBg,
        opacity: 0,
        transition: "opacity 0.3s",
      }}
      _hover={{
        shadow: "xl",
        transform: "translateY(-6px)",
        borderColor: useColorModeValue("orange.300", "orange.600"),
        _before: { opacity: 1 },
      }}
    >
      <Box
        position="relative"
        rounded="lg"
        overflow="hidden"
        aspectRatio={4 / 3}
        bg={useColorModeValue("gray.100", "gray.700")}
        display="flex"
        alignItems="center"
        justifyContent="center"
      >
        <Icon
          as={FiVideo}
          boxSize={10}
          color={useColorModeValue("gray.400", "gray.500")}
        />
        <Button
          size="xs"
          leftIcon={<FiPlay />}
          position="absolute"
          bottom={2}
          left={2}
          colorScheme="brand"
          variant="solid"
        >
          Preview
        </Button>
      </Box>
      <HStack spacing={3} align="flex-start">
        <Avatar name={tutor.name} size="sm" />
        <Stack spacing={1} flex={1} minW={0}>
          <HStack justify="space-between" align="flex-start">
            <HStack spacing={1} align="center" maxW="full">
              <Heading
                size="sm"
                noOfLines={1}
                display="flex"
                alignItems="center"
                gap={1}
              >
                {tutor.name}
                {tutor.verified && (
                  <Icon
                    as={ProIcon}
                    color={proIconColor}
                    boxSize={4}
                    aria-label="Verified tutor"
                    title="Verified tutor"
                  />
                )}
              </Heading>
            </HStack>
            <Rating value={tutor.rating} reviews={tutor.reviews} />
          </HStack>
          <HStack
            spacing={2}
            fontSize="xs"
            color={useColorModeValue("gray.600", "gray.400")}
          >
            <HStack spacing={1}>
              <Icon as={FiGlobe} />
              <Text noOfLines={1}>{tutor.languages.join(", ")}</Text>
            </HStack>
          </HStack>
        </Stack>
      </HStack>
      <Stack spacing={2}>
        <HStack spacing={2} flexWrap="wrap">
          {tutor.specialties.slice(0, 3).map((s) => (
            <Badge
              key={s}
              colorScheme="brand"
              variant="subtle"
              fontSize="10px"
              px={2}
              py={0.5}
              rounded="full"
            >
              {s}
            </Badge>
          ))}
        </HStack>
        <HStack
          fontSize="sm"
          color={useColorModeValue("gray.700", "gray.300")}
          justify="space-between"
        >
          <HStack spacing={1}>
            <Icon as={FiClock} />
            <Text>{tutor.pricePerLesson}$ / lesson</Text>
          </HStack>
          {tutor.availabilityTag && (
            <Badge
              colorScheme="green"
              variant="solid"
              fontSize="10px"
              rounded="full"
            >
              {tutor.availabilityTag}
            </Badge>
          )}
        </HStack>
      </Stack>
      <Flex gap={2} pt={1}>
        <Button size="sm" variant="outline" flex={1} colorScheme="brand">
          Profile
        </Button>
        <Button size="sm" flex={1} colorScheme="brand">
          Book
        </Button>
      </Flex>
    </Stack>
  );
}

export function FeaturedTutors() {
  return (
    <Box as="section" id="featured-tutors" py={{ base: 16, md: 24 }}>
      <Container maxW="6xl">
        <Stack spacing={10}>
          <Stack spacing={4} maxW="2xl">
            <Heading size="lg">Featured tutors</Heading>
            <Text
              fontSize={{ base: "md", md: "lg" }}
              color={useColorModeValue("gray.600", "gray.300")}
            >
              Handpicked for practical, respectful, traveler-focused Swahili
              learning.
            </Text>
          </Stack>
          <SimpleGrid columns={{ base: 1, sm: 2, lg: 4 }} spacing={6}>
            {TUTORS.map((t) => (
              <TutorCard key={t.id} tutor={t} />
            ))}
          </SimpleGrid>
        </Stack>
      </Container>
    </Box>
  );
}
