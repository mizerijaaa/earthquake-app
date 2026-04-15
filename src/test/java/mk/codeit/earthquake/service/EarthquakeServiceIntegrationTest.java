package mk.codeit.earthquake.service;

import mk.codeit.earthquake.model.Earthquake;
import mk.codeit.earthquake.repository.EarthquakeRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

import java.util.List;

import static org.assertj.core.api.Assertions.assertThat;

@SpringBootTest
class EarthquakeServiceIntegrationTest {

    @Autowired
    private EarthquakeService earthquakeService;

    @Autowired
    private EarthquakeRepository repository;

    @BeforeEach
    void setup() {
        repository.deleteAll();
    }

    @Test
    void fetchAndStore_shouldPopulateDatabase() {
        earthquakeService.fetchAndStore();
        List<Earthquake> all = earthquakeService.getAll();
        // All stored earthquakes should be mag > 2.0
        assertThat(all).allMatch(e -> e.getMagnitude() > 2.0);
    }

    @Test
    void getByMinMagnitude_shouldReturnFilteredResults() {
        repository.save(Earthquake.builder()
                .title("Test A").place("Somewhere").magnitude(3.5)
                .magType("ml").time(System.currentTimeMillis()).build());
        repository.save(Earthquake.builder()
                .title("Test B").place("Elsewhere").magnitude(1.0)
                .magType("ml").time(System.currentTimeMillis()).build());

        List<Earthquake> result = earthquakeService.getByMinMagnitude(2.0);
        assertThat(result).hasSize(1);
        assertThat(result.get(0).getMagnitude()).isGreaterThan(2.0);
    }

    @Test
    void getAfterTime_shouldReturnOnlyRecentEntries() {
        long now = System.currentTimeMillis();
        repository.save(Earthquake.builder()
                .title("Old").place("Old place").magnitude(3.0)
                .magType("ml").time(now - 10000).build());
        repository.save(Earthquake.builder()
                .title("New").place("New place").magnitude(3.0)
                .magType("ml").time(now + 10000).build());

        List<Earthquake> result = earthquakeService.getAfterTime(now);
        assertThat(result).hasSize(1);
        assertThat(result.get(0).getTitle()).isEqualTo("New");
    }
}