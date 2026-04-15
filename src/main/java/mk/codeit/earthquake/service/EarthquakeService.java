package mk.codeit.earthquake.service;

import mk.codeit.earthquake.model.Earthquake;
import java.util.List;

public interface EarthquakeService {
    void fetchAndStore();
    List<Earthquake> getAll();
    List<Earthquake> getByMinMagnitude(Double minMag);
    List<Earthquake> getAfterTime(Long timestamp);
    void deleteById(Long id);
}