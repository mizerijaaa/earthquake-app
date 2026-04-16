package mk.codeit.earthquake.service;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import mk.codeit.earthquake.exception.ResourceNotFoundException;
import mk.codeit.earthquake.model.Earthquake;
import mk.codeit.earthquake.repository.EarthquakeRepository;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.ArrayList;
import java.util.List;

@Slf4j
@Service
@RequiredArgsConstructor
public class EarthquakeServiceImpl implements EarthquakeService {

    private static final String USGS_URL =
            "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_hour.geojson";

    private final EarthquakeRepository repository;
    private final ObjectMapper objectMapper = new ObjectMapper();
    private final RestTemplate restTemplate = new RestTemplate();

    @Override
    public void fetchAndStore() {
        try {
            String json = restTemplate.getForObject(USGS_URL, String.class);
            if (json == null) throw new RuntimeException("Empty response from USGS API");

            JsonNode root = objectMapper.readTree(json);
            JsonNode features = root.get("features");

            if (features == null || !features.isArray()) {
                throw new RuntimeException("Invalid GeoJSON structure");
            }

            List<Earthquake> earthquakes = new ArrayList<>();

            for (JsonNode feature : features) {
                try {
                    JsonNode props = feature.get("properties");
                    if (props == null) continue;

                    JsonNode geometry = feature.get("geometry");
                    Double latitude = null;
                    Double longitude = null;

                    if (geometry != null && geometry.has("coordinates")) {
                        JsonNode coords = geometry.get("coordinates");
                        longitude = coords.get(0).asDouble();
                        latitude = coords.get(1).asDouble();
                    }

                    Double mag = props.has("mag") && !props.get("mag").isNull()
                            ? props.get("mag").asDouble() : null;
                    String place = props.has("place") && !props.get("place").isNull()
                            ? props.get("place").asText() : "Unknown";
                    String title = props.has("title") && !props.get("title").isNull()
                            ? props.get("title").asText() : "Unknown";
                    String magType = props.has("magType") && !props.get("magType").isNull()
                            ? props.get("magType").asText() : "Unknown";
                    Long time = props.has("time") && !props.get("time").isNull()
                            ? props.get("time").asLong() : null;

                    if (mag == null || time == null) continue;

                    earthquakes.add(Earthquake.builder()
                            .magnitude(mag)
                            .place(place)
                            .title(title)
                            .magType(magType)
                            .time(time)
                            .latitude(latitude)
                            .longitude(longitude)
                            .build());


                } catch (Exception e) {
                    log.warn("Skipping invalid earthquake entry: {}", e.getMessage());
                }
            }

            repository.deleteAll();
            repository.saveAll(earthquakes);
            log.info("Stored {} earthquakes", earthquakes.size());

        } catch (Exception e) {
            log.error("Failed to fetch earthquake data: {}", e.getMessage());
            throw new RuntimeException("Could not fetch or store earthquake data", e);
        }
    }

    @Override
    public List<Earthquake> getAll() {
        return repository.findAll();
    }

    @Override
    public List<Earthquake> getByMinMagnitude(Double minMag) {
        return repository.findByMagnitudeGreaterThan(minMag);
    }

    @Override
    public List<Earthquake> getAfterTime(Long timestamp) {
        return repository.findByTimeAfter(timestamp);
    }

    @Override
    public void deleteById(Long id) {
        Earthquake eq = repository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException(
                        "Earthquake with id " + id + " not found"));
        repository.delete(eq);
    }


}