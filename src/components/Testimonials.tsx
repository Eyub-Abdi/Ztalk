import {
  Box,
  Container,
  Heading,
  Stack,
  Text,
  Avatar,
  HStack,
  Icon,
  useColorModeValue,
  IconButton,
  VisuallyHidden,
  chakra,
  Flex,
  Badge,
} from "@chakra-ui/react";
import {
  FiStar,
  FiChevronLeft,
  FiChevronRight,
  FiPause,
  FiPlay,
  FiMessageSquare,
} from "react-icons/fi";
import { useKeenSlider } from "keen-slider/react";
import "keen-slider/keen-slider.min.css";
import { useEffect, useState, useCallback, useRef } from "react";

interface Testimonial {
  id: string;
  name: string;
  role: string;
  country: string;
  quote: string;
  rating: number;
  avatar?: string;
}

const DATA: Testimonial[] = [
  {
    id: "1",
    name: "Maria G.",
    role: "Safari Traveler",
    country: "Italy",
    quote:
      "Learning context-based Swahili phrases gave me confidence when negotiating at local markets.",
    rating: 5,
  },
  {
    id: "2",
    name: "Ethan P.",
    role: "Wildlife Photographer",
    country: "USA",
    quote:
      "The tutor adapted lessons to the exact phrases I needed on location – far better than generic apps.",
    rating: 5,
  },
  {
    id: "3",
    name: "Sofia L.",
    role: "Cultural Volunteer",
    country: "Spain",
    quote:
      "Etiquette modules + live correction helped me avoid awkward situations and build trust quickly.",
    rating: 5,
  },
  {
    id: "4",
    name: "Jonas K.",
    role: "Backpacker",
    country: "Germany",
    quote:
      "Short phrase drills on the flight + a trial session made day one in Arusha feel easy.",
    rating: 5,
  },
];

function Stars({ count }: { count: number }) {
  const starGradient = "linear-gradient(135deg, #FFD700 0%, #FFA500 100%)";
  const inactiveColor = useColorModeValue("gray.300", "gray.600");

  return (
    <HStack spacing={0.5} aria-label={`${count} star rating`}>
      {Array.from({ length: 5 }).map((_, i) => {
        const isFilled = i < count;
        return (
          <Box
            key={i}
            position="relative"
            transition="all 0.2s cubic-bezier(0.4, 0, 0.2, 1)"
            _hover={{ transform: "scale(1.15)" }}
            style={{
              animationDelay: `${i * 0.05}s`,
            }}
          >
            <Icon
              as={FiStar}
              fill={isFilled ? starGradient : "none"}
              stroke={isFilled ? "#FFA500" : inactiveColor}
              strokeWidth={1.5}
              boxSize={5}
              filter={
                isFilled
                  ? "drop-shadow(0px 2px 4px rgba(255, 165, 0, 0.3))"
                  : "none"
              }
              sx={
                isFilled
                  ? {
                      fill: "url(#starGradient)",
                      "@keyframes twinkle": {
                        "0%, 100%": { opacity: 1 },
                        "50%": { opacity: 0.8 },
                      },
                    }
                  : {}
              }
            />
            {i === 0 && (
              <Box as="svg" position="absolute" w={0} h={0}>
                <defs>
                  <linearGradient
                    id="starGradient"
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
            )}
          </Box>
        );
      })}
    </HStack>
  );
}

function TestimonialCard({ t }: { t: Testimonial }) {
  const cardBg = useColorModeValue("white", "gray.800");
  const border = useColorModeValue("gray.200", "gray.700");
  const decorativeColor = useColorModeValue("brand.50", "whiteAlpha.100");
  const quoteIconColor = useColorModeValue("brand.100", "whiteAlpha.200");
  const ratingBadgeBg = useColorModeValue("orange.50", "orange.900");
  const ratingBadgeColor = useColorModeValue("orange.800", "orange.200");

  return (
    <Stack
      role="group"
      spacing={4}
      p={6}
      rounded="2xl"
      bg={cardBg}
      borderWidth="1px"
      borderColor={border}
      shadow="sm"
      position="relative"
      transition="all 0.3s cubic-bezier(0.4, 0, 0.2, 1)"
      h="100%"
      overflow="hidden"
      _before={{
        content: '""',
        position: "absolute",
        inset: 0,
        rounded: "2xl",
        bg: useColorModeValue(
          "linear-gradient(135deg, rgba(255,215,0,0.08), rgba(255,165,0,0.04))",
          "linear-gradient(135deg, rgba(255,215,0,0.15), rgba(255,165,0,0.08))"
        ),
        opacity: 0,
        transition: "inherit",
      }}
      _after={{
        content: '""',
        position: "absolute",
        top: -10,
        right: -10,
        w: 32,
        h: 32,
        rounded: "full",
        bg: decorativeColor,
        filter: "blur(20px)",
        opacity: 0.4,
        zIndex: 0,
        transition: "inherit",
      }}
      _hover={{
        shadow: "xl",
        transform: "translateY(-6px)",
        borderColor: useColorModeValue("orange.300", "orange.600"),
        _before: { opacity: 1 },
        _after: { opacity: 0.7, w: 40, h: 40 },
      }}
    >
      <Icon
        as={FiMessageSquare}
        boxSize={10}
        color={quoteIconColor}
        position="absolute"
        top={4}
        left={4}
        opacity={0.3}
        pointerEvents="none"
        zIndex={0}
      />
      <HStack justify="space-between" align="center" zIndex={1}>
        <Stars count={t.rating} />
        <Badge
          bg={ratingBadgeBg}
          color={ratingBadgeColor}
          px={3}
          py={1}
          rounded="full"
          fontSize="xs"
          fontWeight="bold"
          letterSpacing="wide"
        >
          {t.rating.toFixed(1)}
        </Badge>
      </HStack>
      <Text
        fontSize="sm"
        lineHeight={1.7}
        color={useColorModeValue("gray.700", "gray.300")}
        zIndex={1}
      >
        &ldquo;{t.quote}&rdquo;
      </Text>
      <HStack spacing={3} pt={2}>
        <Avatar size="sm" name={t.name} src={t.avatar} />
        <Box>
          <Text fontWeight="semibold" fontSize="sm">
            {t.name}
          </Text>
          <Text fontSize="xs" color={useColorModeValue("gray.600", "gray.400")}>
            {t.role} • {t.country}
          </Text>
        </Box>
      </HStack>
    </Stack>
  );
}

export function Testimonials() {
  const [current, setCurrent] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const wasPlayingRef = useRef(true);
  const isPlayingRef = useRef(isPlaying);
  useEffect(() => {
    isPlayingRef.current = isPlaying;
  }, [isPlaying]);
  const prefersReducedMotion =
    typeof window !== "undefined" &&
    window.matchMedia &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  const autoplayInterval = 4500;
  const [sliderRef, instanceRef] = useKeenSlider(
    {
      initial: 0,
      loop: true,
      slideChanged(s) {
        setCurrent(s.track.details.rel);
      },
      renderMode: "precision",
      breakpoints: {
        "(min-width: 1024px)": { slides: { perView: 4, spacing: 24 } },
        "(min-width: 640px)": { slides: { perView: 2.15, spacing: 20 } },
      },
      slides: { perView: 1.05, spacing: 16 },
    },
    [
      (slider) => {
        let timeout: number | undefined;
        function clearNextTimeout() {
          timeout && window.clearTimeout(timeout);
        }
        function nextTimeout() {
          clearNextTimeout();
          if (!isPlayingRef.current || prefersReducedMotion) return;
          timeout = window.setTimeout(() => {
            slider.next();
          }, autoplayInterval);
        }
        slider.on("created", () => {
          nextTimeout();
        });
        slider.on("dragStarted", clearNextTimeout);
        slider.on("animationEnded", nextTimeout);
        slider.on("updated", nextTimeout);
      },
    ]
  );

  const goTo = useCallback(
    (idx: number) => instanceRef.current && instanceRef.current.moveToIdx(idx),
    [instanceRef]
  );

  const togglePlay = () => setIsPlaying((p) => !p);

  useEffect(() => {
    if (!instanceRef.current) return;
    if (!isPlaying) return;
  }, [isPlaying, instanceRef]);

  const navButtonStyle = {
    variant: "ghost" as const,
    size: "sm" as const,
    rounded: "full",
    colorScheme: "brand" as const,
    bg: useColorModeValue("whiteAlpha.800", "blackAlpha.500"),
    _hover: { bg: useColorModeValue("white", "blackAlpha.600") },
    shadow: "md",
  };

  const dotActiveBorder = useColorModeValue("brand.500", "brand.300");
  const dotInactiveBorder = useColorModeValue("gray.300", "gray.600");
  const sectionBg = useColorModeValue("gray.50", "gray.900");

  return (
    <Box
      as="section"
      id="testimonials"
      py={{ base: 16, md: 24 }}
      bg={sectionBg}
    >
      <Container maxW="6xl">
        <Stack spacing={12}>
          <Stack spacing={4} textAlign="center" maxW="2xl" mx="auto">
            <Heading size="lg">What travelers are saying</Heading>
            <Text
              fontSize={{ base: "md", md: "lg" }}
              color={useColorModeValue("gray.600", "gray.300")}
            >
              Real impact from real journeys. Every session is geared toward
              practical, respectful communication.
            </Text>
          </Stack>

          <Box
            position="relative"
            onMouseEnter={() => {
              wasPlayingRef.current = isPlayingRef.current;
              if (isPlayingRef.current) setIsPlaying(false);
            }}
            onMouseLeave={() => {
              if (wasPlayingRef.current) setIsPlaying(true);
            }}
          >
            <chakra.div
              ref={sliderRef}
              className="keen-slider"
              role="region"
              aria-roledescription="carousel"
              aria-label="Traveler testimonials carousel"
            >
              {DATA.map((t, idx) => (
                <Box
                  key={t.id}
                  className="keen-slider__slide"
                  h="full"
                  display="flex"
                  role="group"
                  aria-label={`Slide ${idx + 1} of ${DATA.length}`}
                >
                  <TestimonialCard t={t} />
                </Box>
              ))}
            </chakra.div>

            <Box
              aria-hidden="true"
              pointerEvents="none"
              position="absolute"
              top={0}
              bottom={0}
              left={0}
              w={24}
              bg={`linear-gradient(to right, ${sectionBg}, rgba(255,255,255,0))`}
              _dark={{
                bg: `linear-gradient(to right, ${sectionBg}, rgba(0,0,0,0))`,
              }}
            />
            <Box
              aria-hidden="true"
              pointerEvents="none"
              position="absolute"
              top={0}
              bottom={0}
              right={0}
              w={24}
              bg={`linear-gradient(to left, ${sectionBg}, rgba(255,255,255,0))`}
              _dark={{
                bg: `linear-gradient(to left, ${sectionBg}, rgba(0,0,0,0))`,
              }}
            />
          </Box>

          <Flex
            direction={{ base: "column", sm: "row" }}
            align={{ base: "stretch", sm: "center" }}
            justify="space-between"
            gap={4}
            flexWrap="wrap"
          >
            <HStack spacing={2}>
              <IconButton
                {...navButtonStyle}
                aria-label="Previous testimonial"
                icon={<FiChevronLeft />}
                onClick={() => instanceRef.current?.prev()}
              />
              <IconButton
                {...navButtonStyle}
                aria-label="Next testimonial"
                icon={<FiChevronRight />}
                onClick={() => instanceRef.current?.next()}
              />
              <IconButton
                aria-label={isPlaying ? "Pause autoplay" : "Play autoplay"}
                icon={isPlaying ? <FiPause /> : <FiPlay />}
                onClick={togglePlay}
                size="sm"
                variant="outline"
                colorScheme="brand"
              />
            </HStack>
            <HStack spacing={2} justify="center" flexWrap="wrap" flex={1}>
              {DATA.map((_, idx) => {
                const isActive = idx === current;
                return (
                  <chakra.button
                    key={idx}
                    onClick={() => goTo(idx)}
                    aria-label={`Go to testimonial ${idx + 1}`}
                    aria-current={isActive ? "true" : undefined}
                    w={3}
                    h={3}
                    rounded="full"
                    borderWidth="2px"
                    borderColor={isActive ? dotActiveBorder : dotInactiveBorder}
                    bg={isActive ? dotActiveBorder : "transparent"}
                    transition="all 0.2s"
                    _focusVisible={{
                      boxShadow: "0 0 0 2px var(--chakra-colors-brand-500)",
                    }}
                  >
                    <VisuallyHidden>
                      {isActive ? "Current slide" : `Go to slide ${idx + 1}`}
                    </VisuallyHidden>
                  </chakra.button>
                );
              })}
            </HStack>
          </Flex>
        </Stack>
      </Container>
    </Box>
  );
}
