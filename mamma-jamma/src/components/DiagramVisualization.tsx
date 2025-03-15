'use client';

import { useEffect, useRef } from 'react';
import * as d3 from 'd3';

interface DiagramProps {
  selectedKey: string;
}

export default function DiagramVisualization({ selectedKey }: DiagramProps) {
  const svgRef = useRef<SVGSVGElement>(null);

  // Function to generate diatonic chords for a given key
  const getDiatonicChords = (key: string) => {
    // This is a simplification - in a real app, you'd calculate these properly
    const diatonicChords = {
      'C': {
        tonic: 'C',
        thirds: [''Em', 'G', 'BdC', im', 'Dm', 'F', 'Am'],
        fourths: ['C', 'F', 'Bdim', 'Em', 'Am', 'Dm', 'G'],
        seconds: ['C', 'Dm', 'Em', 'F', 'G', 'Am', 'Bdim']
      },
      // You would add mappings for other keys here
    };
    
    // Return C as default if the selected key isn't mapped yet
    return diatonicChords[key as keyof typeof diatonicChords] || diatonicChords['C'];
  };

  useEffect(() => {
    if (!svgRef.current) return;

    // Clear previous diagram
    d3.select(svgRef.current).selectAll('*').remove();

    // Set up dimensions
    const width = 1000;          // Overall width of the SVG
    const height = 1000;         // Overall height of the SVG
    const centerX = width / 2;  // Center X position
    const centerY = height / 2; // Center Y position

    // Get diatonic chords for selected key
    const chords = getDiatonicChords(selectedKey);

    // Create SVG
    const svg = d3.select(svgRef.current)
      .attr('width', width)
      .attr('height', height)
      .attr('viewBox', `0 0 ${width} ${height}`)
      .style('max-width', '100%')
      .style('height', 'auto');
    
    // Parameters for the petals and offsets
    const petalLength = 200;    // Length of petal - adjust to make petals longer/shorter
    const petalWidth = 80;      // Width of petal at widest point - adjust for wider/narrower petals
    const centerOffset = 50;    // Offset from center - adjust to move petals away from center
    
    // Chord circle parameters
    const chordRadius = 30;     // Size of chord circles
    
    // Center circle size
    const centerRadius = 60;    // Size of center tonic circle

    // Define petal angles in degrees
    const petalAngles = [0, 135, 225]; // North (3rds), Southeast (2nds), Southwest (4ths)
    const petalNames = ['3rds', '2nds', '4ths']; // Labels for the petals
    const petalColors = ['rgb(97, 238, 84)', 'rgb(229, 30, 123)', 'rgb(206, 216, 20)'];
    const intervalTypes = ['thirds', 'seconds', 'fourths']; // Corresponding keys in the chords object

    // Draw each petal
    petalAngles.forEach((angle, i) => {
      // Convert angle to radians
      const angleRad = angle * (Math.PI / 180);
      
      // Calculate offset in the direction of the angle
      const offsetX = centerOffset * Math.sin(angleRad);
      const offsetY = -centerOffset * Math.cos(angleRad); // Negative because Y increases downward

      // Calculate the starting point of the petal
      const startX = centerX + offsetX;
      const startY = centerY + offsetY;

      // Create a custom oval path with offset from center
      const ovalPath = `
        M ${startX} ${startY}
        a ${petalWidth} ${petalLength} 0 1 0 0 -${petalLength * 2}
        a ${petalWidth} ${petalLength} 0 1 0 0 ${petalLength * 2}
        Z
      `;
      
      // Create a group for this petal
      const petalGroup = svg.append('g');
      
      // Add the oval path
      petalGroup.append('path')
        .attr('d', ovalPath)
        .attr('fill', 'none')
        .attr('stroke', petalColors[i])
        .attr('stroke-width', 5)
        .attr('transform', `rotate(${angle} ${startX} ${startY})`); // Rotate around its own start point

      // Get the list of chords for this interval type
      const chordsList = chords[intervalTypes[i]];
      
      // Place chord circles around the petal
      if (chordsList && chordsList.length > 0) {
        // Skip the first chord (tonic) as it's already in the center
        let intervalChords = chordsList.slice(1);

        // For the 4ths petal, reverse the chord order to fix the issue
        if (intervalTypes[i] === 'fourths') {
          intervalChords = intervalChords.reverse();
        }

        // Place chords evenly around the petal
        intervalChords.forEach((chord, j) => {
          // Calculate position along the oval
          // Here we parameterize the oval from -π/2 (top) around to π/2 (bottom)
          // We distribute the chords evenly across this range
          const numChords = intervalChords.length;
          const totalRange = 2 * Math.PI; // From -π/2 to π/2
          const step = totalRange / (numChords + 1); // +1 to leave space at ends
          const t = -Math.PI/2 + step * (j + 1); // Parameterized position on oval
          
          // Calculate position on the unrotated oval
          const ovalX = startX + petalWidth * Math.sin(t);
          const ovalY = startY - petalLength * (1 + Math.cos(t)); // The center is at 0, top at -petalLength*2
          
          // Rotate to match the petal orientation
          const rotatedX = startX + (ovalX - startX) * Math.cos(angleRad) - (ovalY - startY) * Math.sin(angleRad);
          const rotatedY = startY + (ovalX - startX) * Math.sin(angleRad) + (ovalY - startY) * Math.cos(angleRad);
          
          // Draw chord circle
          svg.append('circle')
            .attr('cx', rotatedX)
            .attr('cy', rotatedY)
            .attr('r', chordRadius)
            .attr('fill', '#1e293b')
            .attr('stroke', petalColors[i])
            .attr('stroke-width', 3)
            .attr('class', 'chord-circle')
            .on('mouseover', function() {
              d3.select(this)
                .transition()
                .duration(200)
                .attr('r', chordRadius * 1.1)
                .attr('stroke-width', 4);
            })
            .on('mouseout', function() {
              d3.select(this)
                .transition()
                .duration(200)
                .attr('r', chordRadius)
                .attr('stroke-width', 3);
            });
          
          // Add chord text
          svg.append('text')
            .attr('x', rotatedX)
            .attr('y', rotatedY)
            .attr('text-anchor', 'middle')
            .attr('dominant-baseline', 'middle')
            .attr('font-family', 'Arial, serif')
            .attr('font-weight', 'bold')
            .attr('font-size', '16px')
            .attr('fill', '#fff')
            .text(chord);
        });
      }

      // Calculate the end point of the petal
      const unrotatedEndX = startX;
      const unrotatedEndY = startY - petalLength * 2;
      
      // Apply rotation to get the actual end point
      const endX = startX + (unrotatedEndX - startX) * Math.cos(angleRad) - (unrotatedEndY - startY) * Math.sin(angleRad);
      const endY = startY + (unrotatedEndX - startX) * Math.sin(angleRad) + (unrotatedEndY - startY) * Math.cos(angleRad);
      
      // Position labels at the end points, with slight offset
      const labelOffsetDistance = 40;
      let labelX, labelY;
      
      if (angle === 0) {
        // Top petal - position label above the end point
        labelX = endX;
        labelY = endY - labelOffsetDistance;
      } else if (angle === 135) {
        // Southeast petal - position label to bottom-right
        labelX = endX + labelOffsetDistance * 0.7;
        labelY = endY + labelOffsetDistance * 0.7;
      } else { // angle === 225
        // Southwest petal - position label to bottom-left
        labelX = endX - labelOffsetDistance * 0.7;
        labelY = endY + labelOffsetDistance * 0.7;
      }
      
      svg.append('text')
        .attr('x', labelX)
        .attr('y', labelY)
        .attr('text-anchor', 'middle')
        .attr('dominant-baseline', 'middle')
        .attr('font-family', 'Arial, serif')
        .attr('font-weight', 'bold')
        .attr('font-size', '22px')
        .attr('fill', petalColors[i])
        .text(petalNames[i]);
    });
    
    // Draw center tonic circle
    svg.append('circle')
      .attr('cx', centerX)
      .attr('cy', centerY)
      .attr('r', centerRadius)
      .attr('fill', '#ec2f3b')
      .attr('stroke', 'rgb(128, 15, 15)')
      .attr('stroke-width', 2)
      .attr('class', 'chord-circle')
      .on('mouseover', function() {
        d3.select(this)
          .transition()
          .duration(200)
          .attr('r', centerRadius * 1.05)
          .attr('stroke-width', 3);
      })
      .on('mouseout', function() {
        d3.select(this)
          .transition()
          .duration(200)
          .attr('r', centerRadius)
          .attr('stroke-width', 2);
      });

    svg.append('text')
      .attr('x', centerX)
      .attr('y', centerY)
      .attr('text-anchor', 'middle')
      .attr('dominant-baseline', 'middle')
      .attr('font-family', 'Arial, serif')
      .attr('font-weight', 'bold')
      .attr('font-size', '40px')
      .attr('fill', 'white')
      .text(selectedKey);
    
  }, [selectedKey]);

  return (
    <div className="w-full flex items-center justify-center">
      <svg ref={svgRef} />
    </div>
  );
}