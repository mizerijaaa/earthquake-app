package mk.codeit.earthquake.repository;

import mk.codeit.earthquake.model.Earthquake;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface EarthquakeRepository extends JpaRepository<Earthquake, Long> {
    List<Earthquake> findByMagnitudeGreaterThan(Double magnitude);
    List<Earthquake> findByTimeAfter(Long time);
}