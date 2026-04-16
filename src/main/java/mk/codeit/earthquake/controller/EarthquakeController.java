package mk.codeit.earthquake.controller;

import lombok.RequiredArgsConstructor;
import mk.codeit.earthquake.dto.EarthquakeDTO;
import mk.codeit.earthquake.service.EarthquakeService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/earthquakes")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class EarthquakeController {

    private final EarthquakeService earthquakeService;

    @PostMapping("/fetch")
    public ResponseEntity<String> fetchAndStore() {
        earthquakeService.fetchAndStore();
        return ResponseEntity.ok("Earthquake data fetched and stored successfully.");
    }

    @GetMapping
    public ResponseEntity<List<EarthquakeDTO>> getAll() {
        List<EarthquakeDTO> result = earthquakeService.getAll()
                .stream()
                .map(EarthquakeDTO::fromEntity)
                .toList();

        return ResponseEntity.ok(result);
    }

    @GetMapping("/filter/magnitude")
    public ResponseEntity<List<EarthquakeDTO>> getByMagnitude(@RequestParam Double minMag) {
        List<EarthquakeDTO> result = earthquakeService.getByMinMagnitude(minMag)
                .stream()
                .map(EarthquakeDTO::fromEntity)
                .toList();

        return ResponseEntity.ok(result);
    }

    @GetMapping("/filter/time")
    public ResponseEntity<List<EarthquakeDTO>> getAfterTime(@RequestParam Long timestamp) {
        List<EarthquakeDTO> result = earthquakeService.getAfterTime(timestamp)
                .stream()
                .map(EarthquakeDTO::fromEntity)
                .toList();

        return ResponseEntity.ok(result);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<String> delete(@PathVariable Long id) {
        earthquakeService.deleteById(id);
        return ResponseEntity.ok("Deleted earthquake with id " + id);
    }
}